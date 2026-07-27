import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import type { ChatMessage } from "../../types/message";
import styles from "./ChatPanel.module.css";

interface Props {
  messages: ChatMessage[];
  isThinking: boolean;
  onSend: (message: string) => void;
}

export default function ChatPanel({
  messages,
  isThinking,
  onSend,
}: Props) {
  return (
    <div className={styles.chatPanel}>
      <h2 className={styles.title}>💬 ONAI Chat</h2>

      <MessageList messages={messages} />

      {isThinking && (
        <div className={styles.thinking}>
          🤖 ONAI is thinking...
        </div>
      )}

      <ChatInput onSend={onSend} />
    </div>
  );
}