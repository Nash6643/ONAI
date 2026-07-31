const API_BASE_URL = 'http://127.0.0.1:8000'; 

export async function sendChatMessage(
  prompt: string,
  base64Image?: string
): Promise<string> {
  try {
    const endpoint = base64Image 
      ? `${API_BASE_URL}/vision/analyze`
      : `${API_BASE_URL}/chat`;

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
    console.log('Backend response payload:', data);

    return (
      data.reply ||
      data.message ||
      data.response ||
      data.analysis ||
      data.text ||
      (typeof data === 'string' ? data : JSON.stringify(data))
    );
  } catch (error) {
    console.error('API Error:', error);
    return 'Could not connect to ONAI server endpoint.';
  }
}