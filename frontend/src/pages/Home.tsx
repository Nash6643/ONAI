import styles from "../styles/Home.module.css";

import Navbar from "../components/Navbar";
import CameraPanel from "../components/camera/CameraPanel";
import type { CameraHandle } from "../components/camera/CameraPanel";
import ChatPanel from "../components/chat/ChatPanel";

import useChat from "../hooks/useChat";
import { analyzeImage } from "../services/vision";
import { useEffect, useRef } from "react";

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

  async function handleSend(prompt: string) {
    addUserMessage(prompt);

    setIsThinking(true);

    try {
      // Try to use the latest frame from VisionContext first.
      // If there isn't one yet, capture a fresh frame.
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
    </div>
  );
}