from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_user
from src.schemas.domain import ProviderCreate, ProviderResponse, ProviderListResponse
from src.repositories.provider_repo import ProviderRepository
from src.repositories.review_repo import ReviewRepository
from src.repositories.booking_repo import BookingRepository
from src.services.provider_service import ProviderService
from src.services.review_service import ReviewService
from src.models import User, ProviderCategory
from src.schemas.domain import ReviewResponse

router = APIRouter(prefix="/providers", tags=["providers"])

def get_provider_service(db: Session = Depends(get_db)) -> ProviderService:
    return ProviderService(ProviderRepository(db))

def get_review_service(db: Session = Depends(get_db)) -> ReviewService:
    return ReviewService(ReviewRepository(db), BookingRepository(db), ProviderRepository(db))

@router.get("", response_model=List[ProviderListResponse])
def list_providers(
    category: Optional[ProviderCategory] = Query(None),
    city: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None),
    service: ProviderService = Depends(get_provider_service)
):
    return service.get_providers(category=category, city=city, min_rating=min_rating)

@router.get("/featured", response_model=List[ProviderListResponse])
def get_featured_providers(service: ProviderService = Depends(get_provider_service)):
    return service.get_featured()

@router.get("/{slug}", response_model=ProviderResponse)
def get_provider(slug: str, service: ProviderService = Depends(get_provider_service)):
    return service.get_by_slug(slug)

@router.post("", response_model=ProviderResponse)
def create_provider(
    provider_in: ProviderCreate,
    current_user: User = Depends(get_current_user),
    service: ProviderService = Depends(get_provider_service)
):
    return service.create_provider(provider_in, current_user)

@router.get("/{slug}/reviews", response_model=List[ReviewResponse])
def get_provider_reviews(slug: str, service: ReviewService = Depends(get_review_service)):
    return service.get_provider_reviews(slug)
