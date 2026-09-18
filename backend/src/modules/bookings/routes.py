from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_user
from src.schemas.domain import BookingCreate, BookingResponse, BookingUpdateStatus
from src.repositories.booking_repo import BookingRepository
from src.repositories.package_repo import PackageRepository
from src.services.booking_service import BookingService
from src.models import User

router = APIRouter(prefix="/bookings", tags=["bookings"])

def get_booking_service(db: Session = Depends(get_db)) -> BookingService:
    return BookingService(BookingRepository(db), PackageRepository(db))

@router.post("", response_model=BookingResponse)
def create_booking(
    booking_in: BookingCreate,
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service)
):
    return service.create_booking(booking_in, current_user)

@router.get("", response_model=List[BookingResponse])
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service)
):
    return service.get_user_bookings(current_user)

@router.get("/{ref}", response_model=BookingResponse)
def get_booking(
    ref: str,
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service)
):
    return service.get_booking(ref, current_user)

@router.put("/{ref}/status", response_model=BookingResponse)
def update_status(
    ref: str,
    status_update: BookingUpdateStatus,
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service)
):
    return service.update_status(ref, status_update, current_user)
