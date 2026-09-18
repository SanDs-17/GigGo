from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.database import engine, Base
from src.models import domain as models
from src.app.api.v1.router import api_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GigGo API (Clean Architecture)",
    description="India's premium entertainment marketplace API",
    version="1.1.0",
)

# CORS - allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 router
app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "GigGo Clean Architecture API is running 🎵"}

@app.get("/health")
def health():
    return {"status": "ok"}
