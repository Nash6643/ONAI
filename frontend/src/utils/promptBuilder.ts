import type { VisionMemory } from "../types/visionMemory";
import type { ConversationTurn } from "../types/conversation"; // Import your project's conversation type!
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
    conversationContext = "Recent Conversation:\n" + relevantHistory
      .map((turn) => {
        // Adjust property access if your ConversationTurn uses userPrompt / aiResponse or user / assistant
        const userMsg = 'user' in turn ? turn.user : (turn as any).userPrompt || (turn as any).prompt;
        const aiMsg = 'assistant' in turn ? turn.assistant : (turn as any).aiResponse || (turn as any).response;
        return `User: ${userMsg}\nAI: ${aiMsg}`;
      })
      .join("\n\n");
  }

  // 3. System Role Framing
  const systemInstruction = `You are ONAI, an intelligent real-time vision assistant with persistent object memory.
${modeInstruction}
${isFollowUp ? "NOTE: This query is a follow-up. Utilize conversation context and object memory to resolve pronouns like 'it', 'this', or 'that'." : ""}`;

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