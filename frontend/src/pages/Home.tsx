import { useEffect, useRef, useState } from "react";
import { buildAdaptivePrompt } from "../utils/promptBuilder";
import { extractObjectName } from "../utils/extractObjectName";
import useVoice from "../hooks/useVoice";
import useSpeech from "../hooks/useSpeech";
import { useVisionSettings } from "../context/VisionSettingsContext";

import styles from "../styles/Home.module.css";

import Navbar from "../components/Navbar";
import CameraPanel from "../components/camera/CameraPanel";
import type { CameraHandle } from "../components/camera/CameraPanel";
import ChatPanel from "../components/chat/ChatPanel";

import useChat from "../hooks/useChat";
import useConversation from "../hooks/useConversation";
import useVisionMemory from "../hooks/useVisionMemory";

import VisionModeSelector from "../components/VisionModeSelector";
import { analyzeImage } from "../services/vision";
import { useVision } from "../context/VisionContext";

export default function Home() {
  const cameraRef = useRef<CameraHandle>(null);

  // 🎧 Sprint 12.3: Hands-Free Mode Toggle
  const [isHandsFree, setIsHandsFree] = useState(false);

  useEffect(() => {
    cameraRef.current?.startLiveCapture();

    return () => {
      cameraRef.current?.stopLiveCapture();
    };
  }, []);

  // Vision Context
  const { latestFrame, setLatestFrame } = useVision();
  const { mode } = useVisionSettings();

  // Speech Hooks
  const { startListening, isListening } = useVoice();
  const { speak, stop: stopSpeech, isSpeaking } = useSpeech();

  // Chat & History
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    isThinking,
    setIsThinking,
    processingStage,
    setProcessingStage,
    clearMessages,
  } = useChat();

  const { memory, addMemory, clearMemory } = useVisionMemory();
  const { history, addTurn } = useConversation();

  function handleVoice() {
    if (isSpeaking) {
      stopSpeech();
    }

    startListening((text) => {
      handleSend(text);
    });
  }

  async function handleSend(prompt: string) {
    stopSpeech();
    addUserMessage(prompt);

    setIsThinking(true);
    setProcessingStage("capturing");

    try {
      let image = latestFrame;

      if (!image) {
        image = (await cameraRef.current?.captureImage()) ?? null;
        if (image) setLatestFrame(image);
      }

      if (!image) {
        throw new Error("Unable to capture image.");
      }

      setProcessingStage("building");

      const enhancedPrompt = buildAdaptivePrompt(
        history,
        prompt,
        mode,
        memory
      );

      setProcessingStage("thinking");

      const visionResponse = await analyzeImage(image, enhancedPrompt);
      
// Safe type cast to inspect dynamic properties cleanly
const resObj = visionResponse as Record<string, any>;

const response: string =
  typeof visionResponse === "string"
    ? visionResponse
    : resObj?.answer ??
      resObj?.text ??
      resObj?.response ??
      "No response text returned.";

      setProcessingStage("responding");

      addAssistantMessage(response);
      addTurn(prompt, response);

      // 🔊 Sprint 12.3: Speak response & auto-listen on completion if hands-free is enabled
      speak(response, () => {
        if (isHandsFree) {
          console.log("Hands-Free Mode active: auto-triggering microphone...");
          handleVoice();
        }
      });

      const now = new Date().toISOString();
      const detectedObject = extractObjectName(response);

      addMemory({
        id: crypto.randomUUID(),
        objectName: detectedObject,
        summary:
          response.length > 250
            ? response.substring(0, 250) + "..."
            : response,
        userPrompt: prompt,
        aiResponse: response,
        frame: image,
        properties: {},
        firstSeen: now,
        lastSeen: now,
        timesSeen: 1,
        timestamp: now,
      });
    } catch (error) {
      console.error(error);
      addErrorMessage(
        error instanceof Error
          ? error.message
          : "Unknown error occurred."
      );
    } finally {
      setProcessingStage("idle");
      setIsThinking(false);
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <VisionModeSelector />

      {/* 🎧 Hands-Free Mode Toggle Control */}
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
        <button
          onClick={() => setIsHandsFree(!isHandsFree)}
          style={{
            background: isHandsFree ? "#10b981" : "#374151",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {isHandsFree ? "🎧 Hands-Free Mode: ON" : "🎙️ Hands-Free Mode: OFF"}
        </button>
      </div>

      <main className={styles.main}>
        <section className={styles.left}>
          <CameraPanel ref={cameraRef} />
        </section>

        <section className={styles.right}>
          <ChatPanel
            messages={messages}
            isThinking={isThinking}
            processingStage={processingStage}
            onSend={handleSend}
            onVoice={handleVoice}
            isListening={isListening}
            onClear={clearMessages}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeech}
          />
        </section>
      </main>

      <pre
        style={{
          color: "#22c55e",
          padding: "20px",
          fontSize: "12px",
          background: "#111827",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(memory, null, 2)}
      </pre>
    </div>
  );
}