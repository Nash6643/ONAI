import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Converts a local file URI (from Expo Camera or Web Blob) to a Base64 string.
 */
export async function convertUriToBase64(uri: string): Promise<string> {
  try {
    if (Platform.OS === 'web') {
      // Web fallback using standard fetch & FileReader
      const response = await fetch(uri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // Native iOS & Android
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    throw error;
  }
}