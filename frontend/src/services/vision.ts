import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});

export async function analyzeImage(
  image: string,
  prompt: string
): Promise<string> {
  try {
    const response = await api.post("/vision/analyze", {
      image,
      prompt,
    });

    return response.data.response;
  } catch (error) {
    console.error(error);

    throw new Error("Unable to contact the ONAI server.");
  }
}