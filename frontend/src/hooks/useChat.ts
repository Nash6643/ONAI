import { useState } from "react";
import type { ChatMessage } from "../types/message";

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

    return {

        messages,

        isThinking,

        setIsThinking,

        addUserMessage,

        addAssistantMessage,

        addErrorMessage,

    };

}