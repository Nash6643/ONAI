import { useState } from "react";

import type { Interaction } from "../types/interaction";

export default function useMemory() {

    const [memory, setMemory] = useState<Interaction[]>([]);

    function addInteraction(interaction: Interaction) {

        setMemory(previous => [

            ...previous,

            interaction,

        ]);

    }

    function clearMemory() {

        setMemory([]);

    }

    function latestInteraction() {

        if (memory.length === 0) {

            return null;

        }

        return memory[memory.length - 1];

    }

    return {

        memory,

        addInteraction,

        clearMemory,

        latestInteraction,

    };

}