import { useRef } from "react";

import Navbar from "../components/Navbar";
import CameraPanel from "../components/camera/CameraPanel";
import type { CameraHandle } from "../components/camera/CameraPanel";
import ChatPanel from "../components/chat/ChatPanel";
import useChat from "../hooks/useChat";
import { analyzeImage } from "../services/vision";

export default function Home() {
  const cameraRef = useRef<CameraHandle>(null);

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    isThinking,
    setIsThinking,
  } = useChat();

  async function handleSend(prompt: string) {
    addUserMessage(prompt);

    setIsThinking(true);

    try {
      const image = cameraRef.current?.captureImage();

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
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
        }}
      >
        <CameraPanel ref={cameraRef} />

        <ChatPanel
          messages={messages}
          isThinking={isThinking}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}