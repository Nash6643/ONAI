import os
from pathlib import Path
from dotenv import load_dotenv

# Force load .env from backend root
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ONAI Backend API")

# Explicit origin matching for Expo Web / Local Dev
origins = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:19006",
    "http://127.0.0.1:19006",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Import routers after dotenv initialization
from app.routes.vision import router as vision_router
from app.routes.chat import router as chat_router
from app.routes.tts import router as tts_router

app.include_router(vision_router)
app.include_router(chat_router)
app.include_router(tts_router)

@app.get("/health")
def health():
    return {"status": "ok"}