import { useState } from "react";

export default function useVoice() {

    const [isListening, setIsListening] = useState(false);


    function startListening(
        callback:(text:string)=>void
    ){

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if(!SpeechRecognition){

            alert(
              "Speech recognition is not supported in this browser."
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-US";

        recognition.continuous = false;

        recognition.interimResults = false;


        recognition.onstart = () => {

            setIsListening(true);

        };


        recognition.onend = () => {

            setIsListening(false);

        };


        recognition.onresult = (event:any)=>{

            const text =
            event.results[0][0].transcript;


            callback(text);

        };


        recognition.start();

    }


    return {

        startListening,

        isListening

    };

}