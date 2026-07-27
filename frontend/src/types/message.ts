export type Sender = "user" | "assistant";

export interface ChatMessage {
    id: string;
    sender: Sender;
    content: string;
    timestamp: Date;
}