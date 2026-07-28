import { useState } from "react";
import type { ChatMessage } from "../types/message";
import type { ProcessingStage } from "../types/processing";

export default function useChat() {

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: crypto.randomUUID(),
            sender: "assistant",
            content:
                "👋 Hello! I'm ONAI. Point your camera at something and ask me anything.",
            timestamp: new Date(),
        },
    ]);

    const [isThinking, setIsThinking] = useState(false);

    const [processingStage, setProcessingStage] = useState<ProcessingStage>("idle");

    function addUserMessage(content: string) {

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                sender: "user",
                content,
                timestamp: new Date(),
            },
        ]);

    }

    function addAssistantMessage(content: string) {

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                sender: "assistant",
                content,
                timestamp: new Date(),
            },
        ]);

    }

    function addErrorMessage(message: string) {

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                sender: "assistant",
                content: `⚠ ${message}`,
                timestamp: new Date(),
            },
        ]);

    }

    function clearMessages() {
        setMessages([]);
    }

    return {
        messages,
        addUserMessage,
        addAssistantMessage,
        addErrorMessage,
        isThinking,
        setIsThinking,
        processingStage,
        setProcessingStage,
        clearMessages,
      };

}