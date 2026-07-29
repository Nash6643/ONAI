import type { VisionMemory } from "../types/visionMemory";

/**
 * Normalizes an object name to its base singular form.
 * e.g., "Lenovo Gaming Laptop" -> "Laptop", "Blue Water Bottle" -> "Water Bottle"
 */
export function extractBaseCategory(rawName: string): string {
  const clean = rawName.trim();
  if (!clean) return "Object";

  // Common category extractions
  const words = clean.split(/\s+/);
  const lastWord = words[words.length - 1];

  // If the last word is a generic noun (laptop, bottle, phone, book, cup, monitor)
  const commonNouns = ["laptop", "phone", "bottle", "cup", "mouse", "keyboard", "book", "pen", "monitor", "headphone", "chair", "table", "watch"];
  
  const matchedNoun = commonNouns.find((noun) =>
    clean.toLowerCase().includes(noun)
  );

  if (matchedNoun) {
    // Capitalize noun (e.g., "laptop" -> "Laptop")
    return matchedNoun.charAt(0).toUpperCase() + matchedNoun.slice(1);
  }

  // Fallback to capitalizing the raw extracted name
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Resolves a detected raw object name to a persistent tracked ID (e.g., "Laptop #1").
 */
export function resolvePersistentObjectID(
  rawObjectName: string,
  memories: VisionMemory[]
): string {
  if (!rawObjectName || rawObjectName.toLowerCase() === "unknown") {
    return "Object #1";
  }

  const baseCategory = extractBaseCategory(rawObjectName);
  const categoryLower = baseCategory.toLowerCase();

  // Find existing memories belonging to the same base category
  const matchingMemories = memories.filter((m) => {
    const nameLower = m.objectName.toLowerCase();
    return nameLower.startsWith(categoryLower) || nameLower.includes(categoryLower);
  });

  if (matchingMemories.length > 0) {
    // Sort by recency to attach to the most recently active instance of that category
    const mostRecentMatch = [...matchingMemories].sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    )[0];

    // If the existing object already has a persistent ID (e.g., "Laptop #1"), re-use it
    if (mostRecentMatch.objectName.includes("#")) {
      return mostRecentMatch.objectName;
    }

    // Upgrade existing name to #1
    return `${baseCategory} #1`;
  }

  // If this is a completely new object category in memory, assign instance #1
  // If there are N existing items of this category, assign instance #(N + 1)
  const countInCategory = matchingMemories.length;
  return `${baseCategory} #${countInCategory + 1}`;
}