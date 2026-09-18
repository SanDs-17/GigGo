import uuid
from typing import List
from fastapi import HTTPException
from src.repositories.booking_repo import BookingRepository
from src.repositories.package_repo import PackageRepository
from src.schemas.domain import BookingCreate, BookingUpdateStatus
from src.models import Booking, User, UserRole

class BookingService:
    def __init__(self, booking_repo: BookingRepository, package_repo: PackageRepository):
        self.booking_repo = booking_repo
        self.package_repo = package_repo

    def create_booking(self, booking_in: BookingCreate, user: User) -> Booking:
        package = self.package_repo.get_by_id(booking_in.package_id)
        if not package or package.provider_id != booking_in.provider_id:
            raise HTTPException(status_code=400, detail="Invalid package for this provider")
        
        advance_amount = int(package.price * 0.25)
        final_amount = package.price - advance_amount

        booking = Booking(
            booking_ref=uuid.uuid4().hex[:8].upper(),
            customer_id=user.id,
            provider_id=booking_in.provider_id,
            package_id=booking_in.package_id,
            event_date=booking_in.event_date.replace(tzinfo=None),
            total_amount=package.price,
            advance_amount=advance_amount,
            final_amount=final_amount,
            notes=booking_in.notes
        )
        return self.booking_repo.create(booking)

    def get_user_bookings(self, user: User) -> List[Booking]:
        if user.role == UserRole.provider:
            # Assuming provider user has one provider profile
            provider = user.provider_profile
            if provider:
                return self.booking_repo.get_by_provider_id(provider.id)
            return []
        return self.booking_repo.get_by_customer_id(user.id)

    def get_booking(self, ref: str, user: User) -> Booking:
        booking = self.booking_repo.get_by_ref(ref)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if user.role == UserRole.customer and booking.customer_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if user.role == UserRole.provider and booking.provider.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return booking

    def update_status(self, ref: str, status_update: BookingUpdateStatus, user: User) -> Booking:
        booking = self.booking_repo.get_by_ref(ref)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Simple authorization check
        if user.role == UserRole.customer and booking.customer_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if user.role == UserRole.provider and booking.provider.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")

        booking.status = status_update.status
        return self.booking_repo.update(booking)
