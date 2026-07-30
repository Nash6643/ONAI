import type { VisionMemory } from "../types/visionMemory";
import { searchVisionMemory } from "./searchVisionMemory";
import { buildSceneDeltaContext } from "./sceneDeltaBuilder";

export function buildVisionContext(
  memories: VisionMemory[],
  currentPrompt: string
): string {
  const lowerPrompt = currentPrompt.toLowerCase();

const needsMemory =
  lowerPrompt.includes("it") ||
  lowerPrompt.includes("this") ||
  lowerPrompt.includes("that") ||
  lowerPrompt.includes("those") ||
  lowerPrompt.includes("these") ||
  lowerPrompt.includes("again") ||
  lowerPrompt.includes("before") ||
  lowerPrompt.includes("previous") ||
  lowerPrompt.includes("earlier");
  // 1. Build Scene Delta Context (for change detection across frames)
  const sceneDelta = buildSceneDeltaContext(memories);
  if (!needsMemory) {
    return `
  ${sceneDelta}
  
  No previous object memory should be used.
  
  Analyse the current image from scratch.
  `;
  }
  if (!memories.length) {
    return `${sceneDelta}\n\nNo prior memory entries available.`;
  }

  // 2. Search Relevant Memory Entries
  let relevantMemories = searchVisionMemory(memories, currentPrompt, 3);

  if (relevantMemories.length === 0) {
    relevantMemories = [...memories]
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
      .slice(0, 2);
  }

  const formattedMemories = relevantMemories
    .map((m) => {
      const props = m.properties
        ? Object.entries(m.properties)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "None";

      return `- Object: ${m.objectName} | Seen: ${m.timesSeen}x | Properties: [${props}] | Summary: ${m.summary}`;
    })
    .join("\n");

  return `${sceneDelta}\n\nRelevant Targeted Memories:\n${formattedMemories}`;
}