import axios from "axios";

export interface VisionResponse {
  answer: string;
  objects: {
    name: string;
    confidence: number;
  }[];
}

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});

export async function analyzeImage(
  image: string,
  prompt: string
): Promise<VisionResponse> {

  const response = await api.post("/vision/analyze", {
    image,
    prompt,
  });

  return response.data;
}