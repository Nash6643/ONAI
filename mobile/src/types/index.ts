export type VisionMode = 'text' | 'object_detection' | 'ocr' | 'scene_description';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUri?: string;
  timestamp: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}