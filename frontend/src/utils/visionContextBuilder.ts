import type { VisionMemory } from "../types/visionMemory";
import { searchVisionMemory } from "./searchVisionMemory";
import { buildSceneDeltaContext } from "./sceneDeltaBuilder";

export function buildVisionContext(
  memories: VisionMemory[],
  currentPrompt: string
): string {
  // 1. Build Scene Delta Context (for change detection across frames)
  const sceneDelta = buildSceneDeltaContext(memories);

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