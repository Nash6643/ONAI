import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { convertUriToBase64 } from '../utils/fileUtils';

type CameraFacing = 'back' | 'front';
type FlashMode = 'off' | 'on' | 'auto';

export interface CapturedImageData {
  uri: string;
  base64: string;
}

interface CameraViewfinderProps {
  onCapture?: (data: CapturedImageData) => void;
  onClose?: () => void;
}

export function CameraViewfinder({ onCapture, onClose }: CameraViewfinderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isProcessingBase64, setIsProcessingBase64] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo?.uri) {
          setPreviewUri(photo.uri);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleConfirmPhoto = async () => {
    if (!previewUri || !onCapture) return;
    try {
      setIsProcessingBase64(true);
      const base64 = await convertUriToBase64(previewUri);
      onCapture({ uri: previewUri, base64 });
    } catch (error) {
      console.error('Error processing captured image:', error);
    } finally {
      setIsProcessingBase64(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  const getFlashIcon = () => {
    switch (flash) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
      default:
        return 'flash-off';
    }
  };

  // Preview & Retake Modal View
  if (previewUri) {
    return (
      <View style={styles.container}>
       <Image source={{ uri: previewUri }} style={styles.fullScreenPreview} resizeMode="cover" />
        
        <View style={styles.previewActionBar}>
          <TouchableOpacity style={[styles.actionBtn, styles.retakeBtn]} onPress={handleRetake} disabled={isProcessingBase64}>
            <Ionicons name="refresh" size={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={handleConfirmPhoto} disabled={isProcessingBase64}>
            {isProcessingBase64 ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>Use Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Live Camera View
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={flash}>
        <View style={styles.topBar}>
          {onClose && (
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons name={getFlashIcon()} size={24} color={flash !== 'off' ? '#FFD700' : '#FFF'} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={28} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shutterButton, isCapturing && styles.shutterButtonDisabled]}
            onPress={takePicture}
            disabled={isCapturing}
          >
            {isCapturing ? <ActivityIndicator color="#FFF" /> : <View style={styles.shutterInner} />}
          </TouchableOpacity>

          <View style={{ width: 44 }} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0F172A',
  },
  permissionText: { color: '#F8FAFC', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permissionButton: { backgroundColor: '#6366F1', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  permissionButtonText: { color: '#FFF', fontWeight: '600' },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonDisabled: { opacity: 0.6 },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF' },
  previewActionBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 130,
    justifyContent: 'center',
  },
  fullScreenPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  retakeBtn: { backgroundColor: 'rgba(15, 23, 42, 0.85)' },
  confirmBtn: { backgroundColor: '#6366F1' },
  actionBtnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});