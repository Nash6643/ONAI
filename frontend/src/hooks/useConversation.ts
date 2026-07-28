import { useState } from "react";

import type { ConversationTurn } from "../types/conversation";

export default function useConversation() {

    const [history, setHistory] = useState<ConversationTurn[]>([]);

    function addTurn(
        prompt: string,
        response: string
    ) {

        setHistory(previous => [

            ...previous,

            {
                id: crypto.randomUUID(),
                prompt,
                response,
                timestamp: new Date(),
            }

        ]);

    }

    function clearConversation() {

        setHistory([]);

    }

    return {

        history,

        addTurn,

        clearConversation,

    };

}