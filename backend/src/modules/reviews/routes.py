from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_user
from src.schemas.domain import ReviewCreate, ReviewResponse
from src.repositories.review_repo import ReviewRepository
from src.repositories.booking_repo import BookingRepository
from src.repositories.provider_repo import ProviderRepository
from src.services.review_service import ReviewService
from src.models import User

router = APIRouter(prefix="/reviews", tags=["reviews"])

def get_review_service(db: Session = Depends(get_db)) -> ReviewService:
    return ReviewService(ReviewRepository(db), BookingRepository(db), ProviderRepository(db))

@router.post("", response_model=ReviewResponse)
def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    service: ReviewService = Depends(get_review_service)
):
    return service.create_review(review_in, current_user)
