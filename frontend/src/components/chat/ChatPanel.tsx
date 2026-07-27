import useChat from "../../hooks/useChat";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import styles from "./ChatPanel.module.css";

export default function ChatPanel() {
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    isThinking,
    setIsThinking,
  } = useChat();

  async function handleSend(message: string) {
    addUserMessage(message);

    setIsThinking(true);

    try {
      // Placeholder until Gemini is connected
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addAssistantMessage(
        "This is a placeholder response. Gemini will answer here soon."
      );
    } catch {
      addErrorMessage("Unable to contact ONAI.");
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className={styles.chatPanel}>
      <h2 className={styles.title}>💬 ONAI Chat</h2>

      <MessageList messages={messages} />

      {isThinking && (
        <div className={styles.thinking}>
          🤖 ONAI is thinking...
        </div>
      )}

      <ChatInput onSend={handleSend} />
    </div>
  );
}