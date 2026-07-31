import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from openai import OpenAI, RateLimitError

router = APIRouter(prefix="/tts", tags=["TTS"])

class TTSRequest(BaseModel):
    text: str
    voice: str = "alloy"

@router.post("/speak")
async def generate_speech(request: TTSRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="OPENAI_API_KEY is missing from environment variables."
        )

    try:
        client = OpenAI(api_key=api_key)

        clean_text = (
            request.text
            .replace("**", "")
            .replace("*", "")
            .replace("#", "")
            .replace("`", "")
            .strip()
        )

        if not clean_text:
            raise HTTPException(status_code=400, detail="Text payload is empty.")

        speech_response = client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=clean_text,
        )

        return Response(content=speech_response.content, media_type="audio/mpeg")

    except RateLimitError as e:
        print("\n[OpenAI Quota Exceeded]: Please check your billing details at platform.openai.com\n")
        raise HTTPException(
            status_code=429, 
            detail="OpenAI API quota exceeded. Please check billing or top up your balance."
        )
    except Exception as e:
        print(f"\n[TTS Error]: {str(e)}\n")
        raise HTTPException(status_code=500, detail=str(e))