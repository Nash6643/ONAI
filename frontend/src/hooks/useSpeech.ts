import { useState, useEffect, useRef } from "react";

export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  /**
   * Speaks the given text using the Web Speech API.
   */
  function speak(text: string, onEnd?: () => void) {
    if (!synthRef.current) return;

    // Stop any ongoing speech before starting new utterance
    stop();

    // Clean markdown formatting (asterisks, hashtags, code blocks) for cleaner speech output
    const cleanText = text
      .replace(/[*#_`~]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = (err) => {
      console.error("Speech synthesis error:", err);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }

  /**
   * Immediately stops any active speech synthesis.
   */
  function stop() {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }

  return {
    speak,
    stop,
    isSpeaking,
  };
}