import type { ChatMessage } from "../../types/message";
import styles from "./MessageBubble.module.css";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const bubbleClass =
    message.sender === "user"
      ? `${styles.message} ${styles.user}`
      : `${styles.message} ${styles.assistant}`;

  return (
    <div className={bubbleClass}>
      <div>{message.content}</div>

      <div className={styles.time}>
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}