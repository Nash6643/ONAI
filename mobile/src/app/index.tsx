import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { CameraViewfinder } from '../components/CamerViewFinder'; // adjust name if you renamed it

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (uri: string) => {
    setCapturedImage(uri);
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <CameraViewfinder
        onCapture={handleCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ONAI Mobile</Text>
      
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.buttonText}>Clear Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.subtitle}>No image captured yet</Text>
      )}

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => setShowCamera(true)}
      >
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 250,
    height: 350,
    borderRadius: 16,
    marginBottom: 12,
  },
});