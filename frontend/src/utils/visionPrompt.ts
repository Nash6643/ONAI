import type { VisionMode } from "../types/visionMode";

export function buildVisionInstructions(
  mode: VisionMode
): string {

  switch (mode) {

    case "focus":
      return `
Focus primarily on the object inside the guide box.

Use the surrounding scene only as supporting context.

Return visual detection data when possible.
`;

    case "scene":
      return `
Describe everything visible in the scene.

Prioritise completeness over detail about any single object.

Return visual detection data when possible.
`;

    case "document":
      return `
The user is showing you a document.

Read the document carefully.

Summarise its contents before answering questions.

Return visual detection data when possible.
`;

    case "ocr":
      return `
Extract every piece of visible text.

Do not describe objects unless they help interpret the text.

Return visual detection data when possible.
`;

    case "object":
      return `
Identify the main object.

Explain:

- what it is
- what it is used for
- important details

Return visual detection data when possible.
`;

    case "describe":
      return `
Provide a detailed visual description.

Mention colours, shapes, materials, lighting and positioning.

Return visual detection data when possible.
`;

    default:
      return "";
  }
}