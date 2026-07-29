from fastapi import APIRouter
from app.models.image_request import ImageRequest
from services.gemini_services import analyze_image

router = APIRouter(
    prefix="/vision",
    tags=["Vision"],
)

@router.post("/analyze")
async def vision(request: ImageRequest):
    result = analyze_image(
        request.image,
        request.prompt,
    )

    return result