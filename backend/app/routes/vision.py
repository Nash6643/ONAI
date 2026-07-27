from fastapi import APIRouter

from app.models.image_request import ImageRequest
from app.services.gemini_service import analyze_image

router = APIRouter(
    prefix="/vision",
    tags=["Vision"],
)


@router.post("/analyze")
def vision(request: ImageRequest):

    result = analyze_image(
        request.image,
        request.prompt
    )

    return {
        "response": result
    }