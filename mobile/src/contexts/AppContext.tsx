import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, VisionMode } from '../types';

interface AppContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  visionMode: VisionMode;
  setVisionMode: (mode: VisionMode) => void;
  isBackendConnected: boolean;
  setIsBackendConnected: (connected: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visionMode, setVisionMode] = useState<VisionMode>('text');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        addMessage,
        visionMode,
        setVisionMode,
        isBackendConnected,
        setIsBackendConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};