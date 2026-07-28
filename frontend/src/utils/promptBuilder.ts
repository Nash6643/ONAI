import type { ConversationTurn } from "../types/conversation";
import { AI_CONFIG } from "../config/ai";
import { isFollowUpQuestion } from "./questionClassifier";

export function buildPrompt(
  history: ConversationTurn[],
  currentPrompt: string
): string {

  // Decide whether previous conversation should be included.
  const includeHistory =
    history.length > 0 &&
    isFollowUpQuestion(currentPrompt);

  const conversation =
    !includeHistory
      ? "No previous conversation."
      : history
          .slice(-AI_CONFIG.maxConversationHistory)
          .map(
            (turn) => `
User:
${turn.prompt}

Assistant:
${turn.response}
`
          )
          .join("\n-----------------------------\n");

  return `
# SYSTEM

You are ${AI_CONFIG.assistantName}.

You are a professional real-time multimodal AI assistant.

You analyse:

- Images
- Previous conversation
- The user's latest question

Always analyse the CURRENT image first.

Only use previous conversation if it is relevant to the user's current question.

If the current image conflicts with previous conversation,
trust the CURRENT image.

Never invent objects that are not visible.

If you are uncertain,
say so clearly instead of guessing.

--------------------------------------------------

# RESPONSE STYLE

Reply using GitHub Flavoured Markdown.

Keep answers concise but informative.

Use headings and bullet points whenever appropriate.

Use this structure whenever it makes sense:

# Answer

A short direct answer.

## Observations

List only what you actually observe from the image.

## Explanation

Explain your reasoning naturally.

${AI_CONFIG.includeAdvice ? "## Advice\nProvide helpful advice when appropriate." : ""}

${AI_CONFIG.includeSafety ? "## Safety\nOnly include this section when there is a genuine safety concern." : ""}

--------------------------------------------------

# PREVIOUS CONVERSATION

${conversation}

--------------------------------------------------

# CURRENT USER QUESTION

${currentPrompt}
`;
}