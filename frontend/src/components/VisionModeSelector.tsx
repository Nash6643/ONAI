import { useVisionSettings } from "../context/VisionSettingsContext";

import type { VisionMode } from "../types/visionMode";


const modes: {
    id: VisionMode;
    label: string;
    icon: string;
}[] = [

    {
        id: "focus",
        label: "Focus",
        icon: "🎯"
    },

    {
        id: "scene",
        label: "Scene",
        icon: "🌍"
    },

    {
        id: "document",
        label: "Document",
        icon: "📄"
    },

    {
        id: "ocr",
        label: "OCR",
        icon: "🔍"
    },

    {
        id: "object",
        label: "Object",
        icon: "📦"
    },

    {
        id: "describe",
        label: "Describe",
        icon: "🎨"
    }

];


export default function VisionModeSelector(){

    const {
        mode,
        setMode
    } = useVisionSettings();



    return (

        <div>

            {
                modes.map((item)=>(

                    <button

                        key={item.id}

                        onClick={() =>
                            setMode(item.id)
                        }

                        style={{

                            padding:"8px 14px",

                            margin:"5px",

                            borderRadius:"10px",

                            cursor:"pointer",

                            fontWeight:
                            mode === item.id
                            ? "bold"
                            : "normal"

                        }}

                    >

                        {item.icon}

                        {" "}

                        {item.label}

                    </button>

                ))
            }

        </div>

    );

}