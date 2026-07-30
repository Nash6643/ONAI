import { ChatMessage } from '../types';

// Update with your local IP or backend URL
const BASE_URL = 'http://10.0.2.2:8000'; // Standard Android Emulator loopback to localhost

export const sendChatMessage = async (
  message: string, 
  imageUri?: string
): Promise<ChatMessage> => {
  const formData = new FormData();
  formData.append('message', message);

  if (imageUri) {
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);
  }

  const response = await fetch(`${BASE_URL}/api/v1/chat`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to connect to ONAI backend');
  }

  return await response.json();
};