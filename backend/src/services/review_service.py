from typing import List
from fastapi import HTTPException
from src.repositories.review_repo import ReviewRepository
from src.repositories.booking_repo import BookingRepository
from src.repositories.provider_repo import ProviderRepository
from src.schemas.domain import ReviewCreate
from src.models import Review, User, BookingStatus

class ReviewService:
    def __init__(self, review_repo: ReviewRepository, booking_repo: BookingRepository, provider_repo: ProviderRepository):
        self.review_repo = review_repo
        self.booking_repo = booking_repo
        self.provider_repo = provider_repo

    def create_review(self, review_in: ReviewCreate, user: User) -> Review:
        booking = self.booking_repo.get_by_id(review_in.booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking.customer_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized to review this booking")
        if booking.status != BookingStatus.completed:
            raise HTTPException(status_code=400, detail="Can only review completed bookings")
        if self.review_repo.get_by_booking_id(booking.id):
            raise HTTPException(status_code=400, detail="Review already exists for this booking")

        review = Review(
            booking_id=booking.id,
            customer_id=user.id,
            provider_id=booking.provider_id,
            rating=review_in.rating,
            content=review_in.content
        )
        created_review = self.review_repo.create(review)

        # Update provider rating
        provider = booking.provider
        total_rating = (provider.rating * provider.review_count) + review.rating
        provider.review_count += 1
        provider.rating = total_rating / provider.review_count
        self.provider_repo.update(provider)

        return created_review

    def get_provider_reviews(self, slug: str) -> List[Review]:
        provider = self.provider_repo.get_by_slug(slug)
        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found")
        return self.review_repo.get_by_provider_id(provider.id)
