from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_services import analyze_image

class VisionRequest(BaseModel):
    image: str
    prompt: str = ""

router = APIRouter(
    prefix="/vision",
    tags=["Vision"],
)

@router.post("/analyze")
async def vision(request: VisionRequest):
    print("NEW REQUEST IMAGE SNIPPET:", request.image[:50])
    result = analyze_image(
        request.image,
        request.prompt,
    )
    return result