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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const cleanMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/`/g, '')
    .trim();
};

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Your Everyday AI, Ready for Anything.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<CapturedImageData | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Audio Playback & TTS State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Audio Recording State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const speakWithBrowserTTS = (text: string, messageId: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleaned = cleanMarkdown(text);
      const utterance = new SpeechSynthesisUtterance(cleaned);

      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeakingMessageId(null);
    }
  };

  const handleOpenAISpeak = async (messageId: string, text: string) => {
    try {
      if (speakingMessageId === messageId) {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setSpeakingMessageId(null);
        return;
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      setSpeakingMessageId(messageId);

      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
      }

      const response = await fetch('http://localhost:8000/tts/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanMarkdown(text),
          voice: 'alloy',
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server response error: ${response.status}`);
      }

      const blob = await response.blob();

      if (Platform.OS === 'web') {
        const audioUrl = URL.createObjectURL(blob);
        const webAudio = new window.Audio(audioUrl);
        
        webAudio.onended = () => setSpeakingMessageId(null);
        webAudio.onerror = () => speakWithBrowserTTS(text, messageId);

        await webAudio.play();
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: base64Audio },
            { shouldPlay: true }
          );
          setSound(newSound);
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setSpeakingMessageId(null);
              newSound.unloadAsync();
              setSound(null);
            }
          });
        };
      }
    } catch (error) {
      console.warn('OpenAI TTS failed. Falling back to Browser TTS:', error);
      speakWithBrowserTTS(text, messageId);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
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

      const aiMsgId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      handleOpenAISpeak(aiMsgId, replyText);
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
      keyboardVerticalOffset={20}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Sleek Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="grid-outline" size={20} color="#A3A3A3" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>ONAI 2.5</Text>
          <Ionicons name="chevron-down" size={14} color="#A3A3A3" style={{ marginLeft: 4 }} />
        </View>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="time-outline" size={20} color="#A3A3A3" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          const isSpeaking = speakingMessageId === item.id;
          const cleanedText = cleanMarkdown(item.text);

          return (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
              )}
              {item.text ? <Text style={styles.messageText}>{cleanedText}</Text> : null}

              <View style={styles.bubbleFooter}>
                {!isUser && item.text && (
                  <TouchableOpacity
                    style={styles.speakerButton}
                    onPress={() => handleOpenAISpeak(item.id, item.text)}
                  >
                    <Ionicons
                      name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                      size={14}
                      color={isSpeaking ? '#FFFFFF' : '#737373'}
                    />
                  </TouchableOpacity>
                )}
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#FFFFFF" size="small" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      {selectedImage && (
        <View style={styles.attachmentBar}>
          <Image source={{ uri: selectedImage.uri }} style={styles.attachmentThumb} />
          <Text style={styles.attachmentText}>Image attached</Text>
          <TouchableOpacity onPress={() => setSelectedImage(null)}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Dark Input Box matching design mockup */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder={isRecording ? 'Listening...' : 'Type your prompt here...'}
            placeholderTextColor={isRecording ? '#EF4444' : '#525252'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <View style={styles.actionRow}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.iconCircleBtn} onPress={() => setIsCameraOpen(true)}>
                <Ionicons name="attach-outline" size={18} color="#D4D4D4" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircleBtn}>
                <Ionicons name="bulb-outline" size={18} color="#D4D4D4" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircleBtn}>
                <Ionicons name="sparkles-outline" size={18} color="#D4D4D4" />
              </TouchableOpacity>
            </View>

            <View style={styles.rightActions}>
              <TouchableOpacity
                style={[styles.iconCircleBtn, isRecording && styles.recordingActiveBtn]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Ionicons
                  name={isRecording ? 'mic' : 'mic-outline'}
                  size={18}
                  color={isRecording ? '#EF4444' : '#D4D4D4'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
              >
                <Ionicons name="arrow-up" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconBtn: {
    padding: 6,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5F5',
    letterSpacing: 0.3,
  },
  messageList: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 10,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#262626',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#E5E5E5',
    lineHeight: 22,
    fontWeight: '400',
  },
  messageImage: {
    width: 210,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  speakerButton: {
    paddingRight: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#525252',
    marginLeft: 'auto',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingText: {
    color: '#737373',
    marginLeft: 8,
    fontSize: 13,
  },
  attachmentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  attachmentThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 10,
  },
  attachmentText: {
    flex: 1,
    color: '#D4D4D4',
    fontSize: 13,
  },
  /* Floating Input Deck */
  inputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#000000',
  },
  inputCard: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#222222',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    minHeight: 40,
    maxHeight: 120,
    textAlignVertical: 'top',
    paddingHorizontal: 4,
    paddingTop: 2,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  recordingActiveBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.6,
  },
});