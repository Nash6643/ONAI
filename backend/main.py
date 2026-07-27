from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.vision import router as vision_router

app = FastAPI(
    title="ONAI API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision_router)


@app.get("/")
def root():

    return {
        "message": "ONAI Backend Running"
    }


@app.get("/health")
def health():

    return {
        "status": "online"
    }