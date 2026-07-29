import type { VisionMemory } from "../types/visionMemory";
import type { ConversationTurn } from "../types/conversation";
import { buildVisionContext } from "./visionContextBuilder";

/**
 * Detects if a user prompt is a follow-up query requiring strict context retention.
 */
function isFollowUpQuery(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  const followUpIndicators = [
    "it", "this", "that", "these", "those",
    "what colour", "what color", "what brand", "where",
    "tell me more", "how much", "why", "again", "what else"
  ];

  return followUpIndicators.some((token) =>
    new RegExp(`\\b${token}\\b`, "i").test(normalized)
  );
}

/**
 * Mode-specific instruction modifiers to sharpen Gemini's visual focus.
 */
function getModeInstruction(mode?: string): string {
  switch (mode?.toLowerCase()) {
    case "ocr":
      return "MODE: OCR & TEXT EXTRACTION. Prioritize reading all text, logos, serial numbers, labels, or fine print in the image.";
    case "focus":
      return "MODE: SINGLE OBJECT FOCUS. Identify the primary foreground object, its precise attributes, brand, state, and properties.";
    case "scene":
      return "MODE: FULL SCENE ANALYSIS. Describe spatial relationships, overall layout, background objects, and environmental context.";
    case "description":
    default:
      return "MODE: GENERAL DESCRIPTION. Provide a natural, concise breakdown of visible objects and key attributes.";
  }
}

/**
 * Safely extracts user and AI text from flexible ConversationTurn schemas.
 */
/**
 * Safely extracts user and AI text from flexible ConversationTurn schemas.
 */
function formatTurn(turn: ConversationTurn): string {
    const t = turn as Record<string, any>;
    const userMsg = t.user || t.userPrompt || t.prompt || "";
    const aiMsg = t.assistant || t.aiResponse || t.response || "";
    return `User: ${userMsg}\nAI: ${aiMsg}`;
  }

/**
 * Builds a lean, adaptive prompt payload for Gemini.
 */
export function buildAdaptivePrompt(
  history: ConversationTurn[],
  currentPrompt: string,
  mode: string,
  memories: VisionMemory[]
): string {
  const isFollowUp = isFollowUpQuery(currentPrompt);
  const modeInstruction = getModeInstruction(mode);

  // 1. Memory Context
  const visionContext = buildVisionContext(memories, currentPrompt);

  // 2. Dynamic History Selection
  let conversationContext = "";
  if (history.length > 0) {
    const relevantHistory = isFollowUp ? history.slice(-3) : history.slice(-1);
    conversationContext =
      "Recent Conversation:\n" +
      relevantHistory.map(formatTurn).join("\n\n");
  }

  // 3. System Role Framing (Fixed string literal backticks)
  const followUpNote = isFollowUp
    ? "\nNOTE: This query is a follow-up. Utilize conversation context and object memory to resolve pronouns like 'it', 'this', or 'that'."
    : "";

  const systemInstruction = `You are ONAI, an intelligent real-time vision assistant with persistent object memory.
${modeInstruction}
IMPORTANT: Base your visual identification PRIMARILY on the CURRENT image provided. Do NOT assume the object is the same as previous turns if the current image shows a different object (e.g., Vaseline, a book, etc.). Only reference previous memory if the user explicitly asks a follow-up about a past item.${followUpNote}`;

  // 4. Final Assembled Payload
  return [
    systemInstruction,
    conversationContext,
    visionContext,
    `Current User Query: "${currentPrompt}"`
  ]
    .filter(Boolean)
    .join("\n\n----------------------------------\n\n");
}