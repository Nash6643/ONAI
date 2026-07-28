import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "../../types/message";

import styles from "./MessageList.module.css";

interface Props {
  messages: ChatMessageType[];
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
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}