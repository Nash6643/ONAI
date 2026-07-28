import { useEffect, useRef } from "react";

import type { ChatMessage } from "../../types/message";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      <div ref={bottomRef} />
    </>
  );
}