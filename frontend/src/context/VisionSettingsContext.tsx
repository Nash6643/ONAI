import {
    createContext,
    useContext,
    useState,
  } from "react";
  
  import type { ReactNode } from "react";
  
  import type { VisionMode } from "../types/visionMode";
  
  interface VisionSettingsContextType {
    mode: VisionMode;
    setMode: (mode: VisionMode) => void;
  }
  
  const VisionSettingsContext =
    createContext<VisionSettingsContextType | null>(null);
  
  export function VisionSettingsProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [mode, setMode] =
      useState<VisionMode>("focus");
  
    return (
      <VisionSettingsContext.Provider
        value={{
          mode,
          setMode,
        }}
      >
        {children}
      </VisionSettingsContext.Provider>
    );
  }
  
  export function useVisionSettings() {
    const context = useContext(
      VisionSettingsContext
    );
  
    if (!context) {
      throw new Error(
        "useVisionSettings must be used inside VisionSettingsProvider"
      );
    }
  
    return context;
  }