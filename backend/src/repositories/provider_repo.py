from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from src.models import Provider, ProviderCategory

class ProviderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, provider_id: int) -> Provider | None:
        return self.db.query(Provider).filter(Provider.id == provider_id).first()

    def get_by_user_id(self, user_id: int) -> Provider | None:
        return self.db.query(Provider).filter(Provider.user_id == user_id).first()

    def get_by_slug(self, slug: str) -> Provider | None:
        return self.db.query(Provider).filter(Provider.slug == slug).first()

    def list(self, category: Optional[ProviderCategory] = None, city: Optional[str] = None, min_rating: Optional[float] = None) -> List[Provider]:
        query = self.db.query(Provider).filter(Provider.is_active == True)
        if category:
            query = query.filter(Provider.category == category)
        if city:
            query = query.filter(func.lower(Provider.city) == func.lower(city))
        if min_rating is not None:
            query = query.filter(Provider.rating >= min_rating)
        return query.all()

    def get_featured(self) -> List[Provider]:
        return self.db.query(Provider).filter(
            Provider.is_active == True,
            Provider.verified == True
        ).order_by(Provider.rating.desc()).limit(8).all()

    def create(self, provider: Provider) -> Provider:
        self.db.add(provider)
        self.db.commit()
        self.db.refresh(provider)
        return provider

    def update(self, provider: Provider) -> Provider:
        self.db.commit()
        self.db.refresh(provider)
        return provider
