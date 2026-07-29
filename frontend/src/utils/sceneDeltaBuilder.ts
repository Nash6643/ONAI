import type { VisionMemory } from "../types/visionMemory";

/**
 * Builds a prompt snippet describing recently active objects in the scene
 * so Gemini can detect additions, removals, or state changes.
 */
export function buildSceneDeltaContext(memories: VisionMemory[]): string {
  if (!memories.length) {
    return "Scene History: This is the initial observation of the scene.";
  }

  const now = Date.now();
  
  // Get objects seen in the last 2 minutes
  const recentObjects = memories.filter((mem) => {
    const elapsedMinutes = (now - new Date(mem.lastSeen).getTime()) / (1000 * 60);
    return elapsedMinutes <= 2;
  });

  if (!recentObjects.length) {
    return "Scene History: No objects observed in the immediate past (last 2 minutes).";
  }

  const objectList = recentObjects
    .map((m) => {
      const secondsAgo = Math.round((now - new Date(m.lastSeen).getTime()) / 1000);
      return `- ${m.objectName} (last seen ${secondsAgo} seconds ago)`;
    })
    .join("\n");

  return `Previous Active Scene Objects (Last 2 minutes):\n${objectList}\n\nTask: Compare the current frame to this previous scene state. Explicitly report if any previously listed object missing, added, or modified.`;
}