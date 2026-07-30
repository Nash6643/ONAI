import * as FileSystem from 'expo-file-system';

/**
 * Converts a local file URI (from Expo Camera) to a Base64 string for Gemini / API payload.
 */
export async function convertUriToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    throw error;
  }
}