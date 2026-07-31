from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.vision import router as vision_router
from app.routes.chat import router as chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision_router)
app.include_router(chat_router)

@app.get("/health")
def health():
    return {"status": "ok"}