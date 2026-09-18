from datetime import datetime
from typing import List, Dict, Any
from src.repositories.booking_repo import BookingRepository
from src.schemas.domain import StudioOverview, ActivityItem
from src.models import Provider, BookingStatus

class StudioService:
    def __init__(self, booking_repo: BookingRepository):
        self.booking_repo = booking_repo

    def get_overview(self, provider: Provider) -> StudioOverview:
        bookings = self.booking_repo.get_by_provider_id(provider.id)
        
        settled = [b for b in bookings if b.status in (BookingStatus.settled, BookingStatus.completed)]
        total_revenue = sum(b.total_amount for b in settled)

        pending = [b for b in bookings if b.status == BookingStatus.requested]
        now = datetime.utcnow()
        expiring = sum(1 for b in pending if (b.created_at - now).total_seconds() < 86400)

        upcoming = [b for b in bookings if b.status == BookingStatus.confirmed and b.event_date > now]
        next_event = min((b.event_date for b in upcoming), default=None)

        total = len(bookings)
        accepted = len([b for b in bookings if b.status != BookingStatus.requested])
        acceptance_rate = round((accepted / total * 100) if total else 0, 1)

        return StudioOverview(
            total_revenue=total_revenue,
            revenue_change=18.0,
            pending_requests=len(pending),
            expiring_soon=expiring,
            upcoming_events=len(upcoming),
            next_event_date=next_event.strftime("%d %b") if next_event else None,
            acceptance_rate=acceptance_rate
        )

    def get_activity(self, provider: Provider) -> List[ActivityItem]:
        bookings = self.booking_repo.get_by_provider_id(provider.id)[:10]
        return [
            ActivityItem(
                customer_name=b.customer.name,
                package_name=b.package.name,
                event_date=b.event_date.strftime("%d %b %Y"),
                amount=b.total_amount,
                status=b.status
            )
            for b in bookings
        ]
