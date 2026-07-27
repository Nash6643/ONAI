from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.image_request import ImageRequest

app = FastAPI(
    title="ONAI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to ONAI API"
    }

@app.get("/health")
def health():
    return {
        "status": "online"
    }

@app.post("/analyze")
def analyze_image(request: ImageRequest):

    print("\n==============================")
    print("ONAI RECEIVED IMAGE")
    print("==============================")

    print(request.image[:100])

    return {
        "success": True,
        "message": "Image received successfully!"
    }