import type { VisionMemory } from "../types/visionMemory";

export function buildVisionContext(memory: VisionMemory[]): string {

    if (memory.length === 0) {
        return "No previous visual observations.";
    }

    const recentObjects = memory
        .slice(-3)
        .map((entry, index) => {

            return `
Object ${index + 1}

Name:
${entry.objectName}

User asked:
${entry.userPrompt}

Summary:
${entry.summary}

Seen:
${entry.timestamp.toLocaleString()}
`;

        })
        .join("\n---------------------------------\n");

    return `
PREVIOUS VISUAL OBSERVATIONS

${recentObjects}
`;
}