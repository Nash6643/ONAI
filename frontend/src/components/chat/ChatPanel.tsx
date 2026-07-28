import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import type { ChatMessage } from "../../types/message";

import styles from "./ChatPanel.module.css";

interface Props {
  messages: ChatMessage[];
  isThinking: boolean;
  onSend: (message: string) => void;
  onClear: () => void;
}

export default function ChatPanel({
  messages,
  isThinking,
  onSend,
  onClear,
}: Props) {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.header}>
        <div className={styles.title}>💬 ONAI Chat</div>

        <button
        className={styles.clearButton}
        onClick={onClear}
      >
        🗑 Clear Chat
      </button>
      </div>

      <div className={styles.messages}>
        <MessageList messages={messages} />
      </div>

      {isThinking && (
        <div className={styles.thinking}>
          🤖 ONAI is analysing your camera...
        </div>
      )}

      <div className={styles.inputArea}>
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}