import { useEffect, useRef } from "react";
import type { ChatMessage as Message } from "../../types/message";
import ChatMessage from "./ChatMessage";
import styles from "./MessageList.module.css";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}