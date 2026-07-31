import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { CameraViewfinder, CapturedImageData } from '../components/CamerViewFinder';
import { sendChatMessage } from '../services/api';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUri?: string;
  timestamp: string;
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm ONAI. Ask me anything, snap a photo, or tap the mic to speak.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<CapturedImageData | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Audio Recording State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Text-to-Speech Handler
  const handleSpeak = (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      Speech.stop();
      setSpeakingMessageId(null);
    } else {
      Speech.stop();
      setSpeakingMessageId(messageId);
      Speech.speak(text, {
        onDone: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null),
      });
    }
  };

  // Voice Recording Handlers
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    
    // Set placeholder voice query or pass audio uri to backend STT
    setInputText((prev) => (prev ? `${prev} [Voice note]` : 'Analyzing voice message...'));
    setRecording(null);
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMsgText = inputText.trim();
    const currentImage = selectedImage;

    setInputText('');
    setSelectedImage(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText || (currentImage ? '[Image attached]' : ''),
      imageUri: currentImage?.uri,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const replyText = await sendChatMessage(
        userMsgText || 'What is in this image?',
        currentImage?.base64
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Automatically speak back AI reply if desired
      Speech.speak(replyText);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I ran into an error connecting to the ONAI server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = (data: CapturedImageData) => {
    setSelectedImage(data);
    setIsCameraOpen(false);
  };

  if (isCameraOpen) {
    return (
      <CameraViewfinder
        onCapture={handleCameraCapture}
        onClose={() => setIsCameraOpen(false)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ONAI Assistant</Text>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          const isSpeaking = speakingMessageId === item.id;

          return (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
              )}
              {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}

              <View style={styles.bubbleFooter}>
                {!isUser && item.text && (
                  <TouchableOpacity
                    style={styles.speakerButton}
                    onPress={() => handleSpeak(item.id, item.text)}
                  >
                    <Ionicons
                      name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                      size={16}
                      color={isSpeaking ? '#6366F1' : '#94A3B8'}
                    />
                  </TouchableOpacity>
                )}
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#6366F1" size="small" />
          <Text style={styles.loadingText}>ONAI is thinking...</Text>
        </View>
      )}

      {/* Attachment Bar */}
      {selectedImage && (
        <View style={styles.attachmentBar}>
          <Image source={{ uri: selectedImage.uri }} style={styles.attachmentThumb} />
          <Text style={styles.attachmentText}>Photo attached</Text>
          <TouchableOpacity onPress={() => setSelectedImage(null)}>
            <Ionicons name="close-circle" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Controls Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setIsCameraOpen(true)}>
          <Ionicons name="camera" size={22} color="#6366F1" />
        </TouchableOpacity>

        {/* Mic Toggle Button */}
        <TouchableOpacity
          style={[styles.iconBtn, isRecording && styles.recordingActiveBtn]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Ionicons
            name={isRecording ? 'mic' : 'mic-outline'}
            size={22}
            color={isRecording ? '#EF4444' : '#6366F1'}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={isRecording ? 'Listening...' : 'Message ONAI...'}
          placeholderTextColor={isRecording ? '#EF4444' : '#94A3B8'}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={(!inputText.trim() && !selectedImage) || isLoading}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC' },
  messageList: { padding: 16, paddingBottom: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6366F1', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#1E293B', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, color: '#F8FAFC', lineHeight: 22 },
  messageImage: { width: 200, height: 150, borderRadius: 8, marginBottom: 8 },
  bubbleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  speakerButton: { paddingRight: 8 },
  timestamp: { fontSize: 10, color: '#94A3B8', marginLeft: 'auto' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  loadingText: { color: '#94A3B8', marginLeft: 8, fontSize: 14 },
  attachmentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  attachmentThumb: { width: 40, height: 40, borderRadius: 6, marginRight: 10 },
  attachmentText: { flex: 1, color: '#F8FAFC', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  iconBtn: { padding: 6 },
  recordingActiveBtn: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: 20 },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonDisabled: { backgroundColor: '#475569', opacity: 0.5 },
});