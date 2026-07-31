from fastapi import APIRouter
from pydantic import BaseModel
# Import your text gemini service here, e.g.:
# from services.gemini_services import generate_text_response

class ChatRequest(BaseModel):
    message: str

router = APIRouter(
    tags=["Chat"],
)

@router.post("/chat")
async def chat(request: ChatRequest):
    # Pass request.message to Gemini or return response
    return {"reply": f"Received message: {request.message}"}