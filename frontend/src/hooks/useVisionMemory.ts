import { useState } from "react";

import type { VisionMemory } from "../types/visionMemory";

export default function useVisionMemory() {

    const [memory, setMemory] = useState<VisionMemory[]>([]);

    function addMemory(entry: VisionMemory) {

        setMemory(previous => [

            ...previous,

            entry,

        ]);

    }

    function clearMemory() {

        setMemory([]);

    }

    return {

        memory,

        addMemory,

        clearMemory,

    };

}