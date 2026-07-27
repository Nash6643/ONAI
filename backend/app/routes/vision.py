from fastapi import APIRouter

from app.models.image_request import ImageRequest
from services.gemini_services import analyze_image

router = APIRouter(
    prefix="/vision",
    tags=["Vision"],
)


@router.post("/analyze")
def vision(request: ImageRequest):
    response = analyze_image(
        request.image,
        request.prompt,
    )

    return {
        "response": response
    }