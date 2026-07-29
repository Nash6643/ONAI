import { useState } from "react";
import type { VisionMemory } from "../types/visionMemory";
import { resolvePersistentObjectID } from "../utils/objectTracker";

export default function useVisionMemory() {
  const [memory, setMemory] = useState<VisionMemory[]>([]);

  /**
   * Adds a new memory or updates an existing memory matching the persistent ID.
   */
  function addOrUpdateMemory(entry: VisionMemory) {
    setMemory((previous) => {
      // Resolve persistent instance tag (e.g., "Laptop #1")
      const persistentIDName = resolvePersistentObjectID(
        entry.objectName,
        previous
      );

      const existingIndex = previous.findIndex(
        (m) => m.objectName.toLowerCase() === persistentIDName.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Object exists -> Update properties, lastSeen, and increment timesSeen
        const existing = previous[existingIndex];
        const updated: VisionMemory = {
          ...existing,
          ...entry,
          objectName: persistentIDName,
          id: existing.id, // Preserve original memory GUID
          firstSeen: existing.firstSeen, // Keep initial observation timestamp
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

      // Brand new persistent object instance
      const now = new Date().toISOString();
      const newEntry: VisionMemory = {
        ...entry,
        objectName: persistentIDName,
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