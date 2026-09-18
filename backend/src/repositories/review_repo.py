from sqlalchemy.orm import Session
from typing import List
from src.models import Review

class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_booking_id(self, booking_id: int) -> Review | None:
        return self.db.query(Review).filter(Review.booking_id == booking_id).first()

    def get_by_provider_id(self, provider_id: int) -> List[Review]:
        return self.db.query(Review).filter(Review.provider_id == provider_id).order_by(Review.created_at.desc()).all()

    def create(self, review: Review) -> Review:
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review
