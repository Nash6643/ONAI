from pydantic import BaseModel


class DetectedObject(BaseModel):
    name: str
    confidence: float


class VisionResponse(BaseModel):
    answer: str
    objects: list[DetectedObject]