// Replace with your local machine's IP address when testing on a physical device, 
// or keep localhost / 10.0.2.2 for emulators.
const API_BASE_URL = 'http://localhost:5000/api'; 

export interface ChatMessagePayload {
  role: 'user' | 'model';
  text: string;
  imageUri?: string;
  imageBase64?: string;
}

export interface ChatResponse {
  message: string;
  success: boolean;
}

/**
 * Sends a text query or a multi-modal query (text + photo base64) to the ONAI backend.
 */
export async function sendChatMessage(
  prompt: string,
  base64Image?: string
): Promise<string> {
  try {
    const endpoint = base64Image ? `${API_BASE_URL}/vision` : `${API_BASE_URL}/chat`;

    const body = base64Image
      ? { prompt, image: base64Image }
      : { message: prompt };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.reply || data.message || 'No response received from ONAI.';
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to reach ONAI service. Make sure your backend server is running.');
  }
}