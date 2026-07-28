import { useEffect, useRef } from "react";

import styles from "../styles/Home.module.css";

import Navbar from "../components/Navbar";
import CameraPanel from "../components/camera/CameraPanel";
import type { CameraHandle } from "../components/camera/CameraPanel";
import ChatPanel from "../components/chat/ChatPanel";

import useChat from "../hooks/useChat";
import useMemory from "../hooks/useMemory";

import { analyzeImage } from "../services/vision";
import { useVision } from "../context/VisionContext";

export default function Home() {
  const cameraRef = useRef<CameraHandle>(null);

  useEffect(() => {
    cameraRef.current?.startLiveCapture();

    return () => {
      cameraRef.current?.stopLiveCapture();
    };
  }, []);

  // Vision Context
  const { latestFrame, setLatestFrame } = useVision();

  // Chat Hook
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    isThinking,
    setIsThinking,
    clearMessages,
  } = useChat();

  // Memory Hook
  const {
    addInteraction,
    memory,
  } = useMemory();

  async function handleSend(prompt: string) {
    addUserMessage(prompt);

    setIsThinking(true);

    try {
      let image = latestFrame;

      if (!image) {
        image = cameraRef.current?.captureImage() || null;

        if (image) {
          setLatestFrame(image);
        }
      }

      if (!image) {
        throw new Error("Unable to capture image.");
      }

      const response = await analyzeImage(image, prompt);

      console.log("Gemini Response:", response);

      addAssistantMessage(response);

      addInteraction({
        id: crypto.randomUUID(),
        prompt,
        frame: image,
        response,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);

      addErrorMessage(
        error instanceof Error
          ? error.message
          : "Unknown error occurred."
      );
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.left}>
          <CameraPanel ref={cameraRef} />
        </section>

        <section className={styles.right}>
          <ChatPanel
            messages={messages}
            isThinking={isThinking}
            onSend={handleSend}
            onClear={clearMessages}
          />
        </section>
      </main>

      {/* Temporary Memory Debug */}
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