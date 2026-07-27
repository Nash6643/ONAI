import { useState } from "react";
import styles from "./ChatInput.module.css";

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  function send() {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  }

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask ONAI anything..."
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
      />

      <button
        className={styles.button}
        onClick={send}
      >
        Send
      </button>
    </div>
  );
}