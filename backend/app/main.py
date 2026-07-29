from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.vision import router as vision_router

app = FastAPI()

# Add CORS BEFORE routers!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (localhost:5173, 127.0.0.1:5173, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision_router)

@app.get("/health")
def health():
    return {"status": "ok"}