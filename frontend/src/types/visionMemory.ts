export interface VisionMemoryProperties {
    color?: string;
    brand?: string;
    type?: string;
    [key: string]: string | undefined; // Allows flexible additional properties
  }
  
  export interface VisionMemory {
    id: string;
    objectName: string;
    summary?: string;
    userPrompt?: string;
    aiResponse?: string;
    frame?: string; // Base64 image snapshot
    
    // Knowledge & tracking fields (Sprint 11.2+)
    properties?: VisionMemoryProperties;
    firstSeen: string; // ISO date string or timestamp
    lastSeen: string;  // ISO date string or timestamp
    timesSeen: number;
    timestamp: string;
  }