from sqlalchemy.orm import Session
from typing import List
from src.models import Booking

class BookingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, booking_id: int) -> Booking | None:
        return self.db.query(Booking).filter(Booking.id == booking_id).first()

    def get_by_ref(self, booking_ref: str) -> Booking | None:
        return self.db.query(Booking).filter(Booking.booking_ref == booking_ref).first()

    def get_by_customer_id(self, customer_id: int) -> List[Booking]:
        return self.db.query(Booking).filter(Booking.customer_id == customer_id).order_by(Booking.created_at.desc()).all()

    def get_by_provider_id(self, provider_id: int) -> List[Booking]:
        return self.db.query(Booking).filter(Booking.provider_id == provider_id).order_by(Booking.created_at.desc()).all()

    def create(self, booking: Booking) -> Booking:
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def update(self, booking: Booking) -> Booking:
        self.db.commit()
        self.db.refresh(booking)
        return booking
