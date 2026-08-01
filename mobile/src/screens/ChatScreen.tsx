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
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
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

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Current Session',
    date: 'Today',
    messages: [
      {
        id: '1',
        sender: 'ai',
        text: "Your Everyday AI, Ready for Anything.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'session-2',
    title: 'Rust Database Engine Architecture',
    date: 'Yesterday',
    messages: [
      { id: '101', sender: 'user', text: 'How do I implement hash indexes in Rust?', timestamp: '14:20' },
      { id: '102', sender: 'ai', text: 'You can use fixed-size buckets with offset indexing...', timestamp: '14:21' },
    ],
  },
  {
    id: 'session-3',
    title: 'System Requirements & UML Specs',
    date: '3 days ago',
    messages: [
      { id: '201', sender: 'user', text: 'Generate an activity diagram layout for modern web app.', timestamp: '11:05' },
      { id: '202', sender: 'ai', text: 'Here is the step-by-step state breakdown...', timestamp: '11:06' },
    ],
  },
];

const PROMPT_STARTERS = [
  { title: 'System Design Overview', icon: 'server-outline', prompt: 'Write a high-level architecture & system design summary for ' },
  { title: 'Debug & Refactor Code', icon: 'code-slash-outline', prompt: 'Review this code snippet for performance optimizations and bugs:\n\n' },
  { title: 'Analyze Attached Image', icon: 'image-outline', prompt: 'Analyze this image and detail its key components and architecture.' },
  { title: 'Explain Math Concept', icon: 'calculator-outline', prompt: 'Explain the following concept step-by-step with clear examples: ' },
];

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
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [messages, setMessages] = useState<Message[]>(INITIAL_SESSIONS[0].messages);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<CapturedImageData | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Mode Toggles
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isIdeasVisible, setIsIdeasVisible] = useState(false);
  const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false);

  // Audio Playback & TTS State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Audio Recording State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Handler: Start New Chat
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      date: 'Just now',
      messages: [
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: 'Your Everyday AI, Ready for Anything.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages(newSession.messages);
    setIsSidebarVisible(false);
    setIsHistoryVisible(false);
  };

  // Handler: Switch Chat Session
  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setIsSidebarVisible(false);
    setIsHistoryVisible(false);
  };

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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Update title of active session if it's the first prompt
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const title = s.title === 'New Conversation' ? userMsgText.slice(0, 24) || 'Image Analysis' : s.title;
          return { ...s, title, messages: updatedMessages };
        }
        return s;
      })
    );

    try {
      // Append deep think flag if mode is enabled
      const finalPrompt = isDeepThinkEnabled
        ? `[Deep Reasoning Mode Engaged]\n${userMsgText}`
        : userMsgText;

      const replyText = await sendChatMessage(
        finalPrompt || 'What is in this image?',
        currentImage?.base64
      );

      const aiMsgId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: finalMessages } : s))
      );

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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => setIsSidebarVisible(true)}>
          <Ionicons name="grid-outline" size={20} color="#A3A3A3" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerTitleContainer} onPress={() => setIsSidebarVisible(true)}>
          <Text style={styles.headerTitle}>
            {isDeepThinkEnabled ? 'ONAI 2.5 Pro (Deep)' : 'ONAI 2.5'}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#A3A3A3" style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerIconBtn} onPress={() => setIsHistoryVisible(true)}>
          <Ionicons name="time-outline" size={20} color="#A3A3A3" />
        </TouchableOpacity>
      </View>

      {/* Message Stream */}
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
          <Text style={styles.loadingText}>
            {isDeepThinkEnabled ? 'Thinking deeply...' : 'Thinking...'}
          </Text>
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

      {/* Input Dock */}
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
                <Ionicons name="camera-outline" size={18} color="#D4D4D4" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconCircleBtn} onPress={() => setIsIdeasVisible(true)}>
                <Ionicons name="bulb-outline" size={18} color="#D4D4D4" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconCircleBtn, isDeepThinkEnabled && styles.activeModeBtn]}
                onPress={() => setIsDeepThinkEnabled(!isDeepThinkEnabled)}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color={isDeepThinkEnabled ? '#818CF8' : '#D4D4D4'}
                />
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

      {/* 1. SIDEBAR DRAWER MODAL (GRID ICON) */}
      <Modal visible={isSidebarVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setIsSidebarVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sidebarContent}>
                <View style={styles.sidebarHeader}>
                  <Text style={styles.sidebarTitle}>ONAI Workspace</Text>
                  <TouchableOpacity onPress={() => setIsSidebarVisible(false)}>
                    <Ionicons name="close" size={20} color="#A3A3A3" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.newChatBtn} onPress={handleNewChat}>
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.newChatBtnText}>New Chat</Text>
                </TouchableOpacity>

                <Text style={styles.sectionHeading}>Recent Conversations</Text>
                <ScrollView style={{ flex: 1 }}>
                  {sessions.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.sessionItem,
                        s.id === activeSessionId && styles.activeSessionItem,
                      ]}
                      onPress={() => handleSelectSession(s)}
                    >
                      <Ionicons name="chatbox-outline" size={16} color="#A3A3A3" />
                      <Text style={styles.sessionItemText} numberOfLines={1}>
                        {s.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 2. CHAT HISTORY QUICK-VIEW MODAL (TIME ICON) */}
      <Modal visible={isHistoryVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setIsHistoryVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Session History</Text>
                  <TouchableOpacity onPress={() => setIsHistoryVisible(false)}>
                    <Ionicons name="close" size={20} color="#A3A3A3" />
                  </TouchableOpacity>
                </View>

                {sessions.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.historyRow}
                    onPress={() => handleSelectSession(s)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyRowTitle}>{s.title}</Text>
                      <Text style={styles.historyRowDate}>{s.date}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#525252" />
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 3. PROMPT STARTER SHEET MODAL (BULB ICON) */}
      <Modal visible={isIdeasVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setIsIdeasVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.ideasCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Prompt Ideas & Templates</Text>
                  <TouchableOpacity onPress={() => setIsIdeasVisible(false)}>
                    <Ionicons name="close" size={20} color="#A3A3A3" />
                  </TouchableOpacity>
                </View>

                {PROMPT_STARTERS.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.ideaItem}
                    onPress={() => {
                      setInputText(item.prompt);
                      setIsIdeasVisible(false);
                    }}
                  >
                    <Ionicons name={item.icon as any} size={20} color="#818CF8" style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ideaTitle}>{item.title}</Text>
                      <Text style={styles.ideaPromptText} numberOfLines={1}>{item.prompt}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconBtn: { padding: 6 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#F5F5F5', letterSpacing: 0.3 },
  messageList: { paddingHorizontal: 18, paddingBottom: 16, paddingTop: 10 },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 18, marginBottom: 14 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#262626', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#121212', borderWidth: 1, borderColor: '#1F1F1F', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, color: '#E5E5E5', lineHeight: 22, fontWeight: '400' },
  messageImage: { width: 210, height: 150, borderRadius: 12, marginBottom: 8 },
  bubbleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  speakerButton: { paddingRight: 8 },
  timestamp: { fontSize: 10, color: '#525252', marginLeft: 'auto' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  loadingText: { color: '#737373', marginLeft: 8, fontSize: 13 },
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
  attachmentThumb: { width: 36, height: 36, borderRadius: 6, marginRight: 10 },
  attachmentText: { flex: 1, color: '#D4D4D4', fontSize: 13 },
  inputWrapper: { paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 24 : 16, backgroundColor: '#000000' },
  inputCard: { backgroundColor: '#121212', borderRadius: 24, padding: 14, borderWidth: 1, borderColor: '#222222' },
  input: { color: '#FFFFFF', fontSize: 15, minHeight: 40, maxHeight: 120, textAlignVertical: 'top', paddingHorizontal: 4, paddingTop: 2, marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftActions: { flexDirection: 'row', gap: 8 },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconCircleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1C1C1C', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  activeModeBtn: { borderColor: '#818CF8', backgroundColor: 'rgba(129, 140, 248, 0.18)' },
  recordingActiveBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#EF4444' },
  sendButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#333333', opacity: 0.6 },
  
  /* Modal Overlay & Styling */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  sidebarContent: { height: '85%', backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: '#262626' },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sidebarTitle: { fontSize: 18, fontWeight: '700', color: '#F5F5F5' },
  newChatBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#262626', paddingVertical: 12, borderRadius: 14, marginBottom: 20 },
  newChatBtnText: { color: '#FFFFFF', fontWeight: '600', marginLeft: 6, fontSize: 15 },
  sectionHeading: { color: '#737373', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  sessionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6 },
  activeSessionItem: { backgroundColor: '#1E1E1E' },
  sessionItemText: { color: '#E5E5E5', marginLeft: 10, fontSize: 14 },

  historyCard: { backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: '#262626' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  historyTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1F1F1F' },
  historyRowTitle: { color: '#E5E5E5', fontSize: 14, fontWeight: '500' },
  historyRowDate: { color: '#737373', fontSize: 12, marginTop: 2 },

  ideasCard: { backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: '#262626' },
  ideaItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#1C1C1C', borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  ideaTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  ideaPromptText: { color: '#737373', fontSize: 12, marginTop: 2 },
});