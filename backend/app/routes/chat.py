from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai

router = APIRouter(prefix="/chat", tags=["Chat"])

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []

@router.post("")
async def chat_endpoint(req: ChatRequest):
    try:
        # 1. Use the working model name
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # 2. Convert incoming history safely
        formatted_history = []
        for msg in req.history:
            # Skip empty content or non-text system messages
            if not msg.content:
                continue
            
            role = "user" if msg.role in ["user", "human"] else "model"
            formatted_history.append({
                "role": role,
                "parts": [msg.content]
            })

        # 3. Start chat session and send message
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(req.message)
        
        return {"response": response.text}

    except Exception as e:
        print(f"[Chat Error]: {e}")
        raise HTTPException(status_code=500, detail=str(e))