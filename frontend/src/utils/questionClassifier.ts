const FOLLOW_UP_PRONOUNS = [
    "it",
    "this",
    "that",
    "they",
    "them",
    "its",
    "their",
    "these",
    "those",
  ];
  
  const FOLLOW_UP_PHRASES = [
    "how do i",
    "how can i",
    "how much",
    "how many",
    "what colour",
    "what color",
    "what size",
    "what about",
    "tell me more",
    "can i",
    "should i",
    "does it",
    "is it",
    "will it",
    "why is it",
    "where is it",
  ];
  
  export function isFollowUpQuestion(question: string): boolean {
    const text = question
      .trim()
      .toLowerCase()
      .replace(/[?.!,]/g, "");
  
    // Explicit follow-up phrases
    if (FOLLOW_UP_PHRASES.some((phrase) => text.startsWith(phrase))) {
      return true;
    }
  
    // Tokenise the question
    const words = text.split(/\s+/);
  
    // Pronouns like "it", "this", "that"
    if (words.some((word) => FOLLOW_UP_PRONOUNS.includes(word))) {
      return true;
    }
  
    // Questions beginning with connectors
    if (
      text.startsWith("and ") ||
      text.startsWith("also ") ||
      text.startsWith("then ")
    ) {
      return true;
    }
  
    return false;
  }