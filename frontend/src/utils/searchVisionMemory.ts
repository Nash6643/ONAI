import type { VisionMemory } from "../types/visionMemory";

export interface MemorySearchResult {
  memory: VisionMemory;
  score: number;
}

/**
 * Searches and ranks vision memories against a user prompt.
 * Returns the most relevant memories up to `maxResults`.
 */
export function searchVisionMemory(
  memories: VisionMemory[],
  query: string,
  maxResults: number = 3
): VisionMemory[] {
  if (!memories.length || !query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored: MemorySearchResult[] = memories.map((mem) => {
    let score = 0;
    const objName = mem.objectName.toLowerCase();

    // 1. Direct object name match (High priority)
    if (normalizedQuery.includes(objName)) {
      score += 10;
    } else if (queryWords.some((word) => objName.includes(word))) {
      score += 5;
    }

    // 2. Property values match (e.g., "blue", "Lenovo", "laptop")
    if (mem.properties) {
      Object.values(mem.properties).forEach((val) => {
        if (val && normalizedQuery.includes(val.toLowerCase())) {
          score += 4;
        }
      });
    }

    // 3. User prompt or summary keyword matches
    queryWords.forEach((word) => {
      if (mem.summary?.toLowerCase().includes(word)) score += 1;
      if (mem.userPrompt?.toLowerCase().includes(word)) score += 1;
    });

    // 4. Slight recency boost (memories seen in the last 10 minutes)
    const lastSeenTime = new Date(mem.lastSeen).getTime();
    const minutesAgo = (Date.now() - lastSeenTime) / (1000 * 60);
    if (minutesAgo <= 10) {
      score += 2;
    }

    return { memory: mem, score };
  });

  // Filter out irrelevant items (score > 0) and sort descending by score
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.memory);
}