from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_services import analyze_image

# Request schema
class VisionRequest(BaseModel):
    image: str
    prompt: str = ""

router = APIRouter(
    prefix="/vision",
    tags=["Vision"],
)

# Changed from "/vision/analyze" to "/analyze" so the final route is "/vision/analyze"
@router.post("/analyze")
async def vision(request: VisionRequest):
    # Print statement to debug frontend base64 image captures
    print("NEW REQUEST IMAGE SNIPPET:", request.image[:50])

    result = analyze_image(
        request.image,
        request.prompt,
    )
    return result