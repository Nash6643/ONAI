import type { ChatMessage as Message } from "../../types/message";
import styles from "./ChatMessage.module.css";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`${styles.wrapper} ${
        isUser ? styles.user : styles.assistant
      }`}
    >
      <div className={styles.content}>
        <span className={styles.label}>
          {isUser ? "👤 You" : "🤖 ONAI"}
        </span>

        <div
          className={`${styles.bubble} ${
            isUser ? styles.userBubble : styles.assistantBubble
          }`}
        >
          {message.content}
        </div>

        <span className={styles.time}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}