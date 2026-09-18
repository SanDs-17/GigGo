from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_provider
from src.schemas.domain import StudioOverview, ActivityItem, BookingResponse
from src.repositories.booking_repo import BookingRepository
from src.services.studio_service import StudioService
from src.models import Provider

router = APIRouter(prefix="/studio", tags=["studio"])

def get_studio_service(db: Session = Depends(get_db)) -> StudioService:
    return StudioService(BookingRepository(db))

@router.get("/overview", response_model=StudioOverview)
def studio_overview(
    provider: Provider = Depends(get_current_provider),
    service: StudioService = Depends(get_studio_service)
):
    return service.get_overview(provider)

@router.get("/bookings", response_model=List[BookingResponse])
def studio_bookings(
    provider: Provider = Depends(get_current_provider),
    service: StudioService = Depends(get_studio_service)
):
    # Reuse booking_repo for simple queries
    return service.booking_repo.get_by_provider_id(provider.id)

@router.get("/activity", response_model=List[ActivityItem])
def studio_activity(
    provider: Provider = Depends(get_current_provider),
    service: StudioService = Depends(get_studio_service)
):
    return service.get_activity(provider)
