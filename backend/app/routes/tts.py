import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
import edge_tts
router = APIRouter(prefix="/tts", tags=["TTS"])

class TTSRequest(BaseModel):
    text: str
    voice: str = "en-GB-SoniaNeural"

@router.post("/speak")
async def generate_speech(req: TTSRequest):
    try:
        if not req.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        # Fall back to Sonia if no valid neural voice string is passed
        voice = req.voice if "Neural" in req.voice else "en-GB-SoniaNeural"
        
        communicate = edge_tts.Communicate(req.text, voice)
        mp3_bytes = bytearray()

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                mp3_bytes.extend(chunk["data"])

        return Response(content=bytes(mp3_bytes), media_type="audio/mpeg")

    except Exception as e:
        print(f"[Edge-TTS Error]: {e}")
        raise HTTPException(status_code=500, detail=str(e))