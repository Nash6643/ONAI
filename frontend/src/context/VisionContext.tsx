import {
    createContext,
    useContext,
    useState,
    type ReactNode,
  } from "react";
  
  interface VisionContextType {
    latestFrame: string | null;
    setLatestFrame: (frame: string | null) => void;
  }
  
  const VisionContext = createContext<VisionContextType | undefined>(undefined);
  
  export function VisionProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [latestFrame, setLatestFrame] = useState<string | null>(null);
  
    return (
      <VisionContext.Provider
        value={{
          latestFrame,
          setLatestFrame,
        }}
      >
        {children}
      </VisionContext.Provider>
    );
  }
  
  export function useVision() {
    const context = useContext(VisionContext);
  
    if (!context) {
      throw new Error(
        "useVision must be used inside VisionProvider"
      );
    }
  
    return context;
  }