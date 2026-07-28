export function extractObjectName(response: string): string {

    const lines = response.split("\n");

    for (const line of lines) {

        const cleaned = line.trim();

        if (
            cleaned.startsWith("# Answer") ||
            cleaned.startsWith("## Answer")
        ) {
            continue;
        }

        if (cleaned.length > 0) {

            return cleaned
                .replace(/\*\*/g, "")
                .replace(/^[-#\s]+/, "")
                .trim();

        }

    }

    return "Unknown Object";

}