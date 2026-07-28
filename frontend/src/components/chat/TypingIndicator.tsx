import styles from "./TypingIndicator.module.css";
import type { ProcessingStage } from "../../types/processing";

interface Props {
  stage: ProcessingStage;
}

export default function TypingIndicator({ stage }: Props) {

  const message = {

    capturing: "📷 Capturing image...",

    building: "🧠 Building prompt...",

    thinking: "🤖 Analysing image...",

    responding: "💬 Writing response...",

    idle: ""

  }[stage];

  return (
    <div className={styles.container}>

      <div className={styles.bubble}>

        <span></span>
        <span></span>
        <span></span>

        <p>{message}</p>

      </div>

    </div>
  );
}