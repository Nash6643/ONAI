import { useState } from "react";
import type { VisionMemory } from "../types/visionMemory";

export default function useVisionMemory() {
  const [memory, setMemory] = useState<VisionMemory[]>([]);

  /**
   * Adds a new memory or updates an existing memory if the same object exists.
   */
  function addOrUpdateMemory(entry: VisionMemory) {
    setMemory((previous) => {
      const existingIndex = previous.findIndex(
        (m) => m.objectName.toLowerCase() === entry.objectName.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Object exists -> Update properties, lastSeen, and increment timesSeen
        const existing = previous[existingIndex];
        const updated: VisionMemory = {
          ...existing,
          ...entry,
          id: existing.id, // Preserve original ID
          firstSeen: existing.firstSeen, // Retain original creation time
          lastSeen: entry.timestamp || new Date().toISOString(),
          timesSeen: existing.timesSeen + 1,
          properties: {
            ...existing.properties,
            ...entry.properties,
          },
        };

        const next = [...previous];
        next[existingIndex] = updated;
        return next;
      }

      // New object -> Add entry with initial metadata
      const now = new Date().toISOString();
      const newEntry: VisionMemory = {
        ...entry,
        firstSeen: entry.firstSeen || now,
        lastSeen: entry.lastSeen || now,
        timesSeen: entry.timesSeen || 1,
        timestamp: entry.timestamp || now,
        properties: entry.properties || {},
      };

      return [...previous, newEntry];
    });
  }

  function clearMemory() {
    setMemory([]);
  }

  return {
    memory,
    addMemory: addOrUpdateMemory,
    clearMemory,
  };
}