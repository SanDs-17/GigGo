from typing import List, Optional
from fastapi import HTTPException
from src.repositories.provider_repo import ProviderRepository
from src.schemas.domain import ProviderCreate, ProviderResponse
from src.models import Provider, ProviderCategory, User

class ProviderService:
    def __init__(self, provider_repo: ProviderRepository):
        self.provider_repo = provider_repo

    def get_providers(self, category: Optional[ProviderCategory] = None, city: Optional[str] = None, min_rating: Optional[float] = None) -> List[Provider]:
        return self.provider_repo.list(category=category, city=city, min_rating=min_rating)

    def get_featured(self) -> List[Provider]:
        return self.provider_repo.get_featured()

    def get_by_slug(self, slug: str) -> Provider:
        provider = self.provider_repo.get_by_slug(slug)
        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found")
        return provider

    def create_provider(self, provider_in: ProviderCreate, user: User) -> Provider:
        if self.provider_repo.get_by_user_id(user.id):
            raise HTTPException(status_code=400, detail="User already has a provider profile")

        slug = provider_in.name.lower().replace(" ", "-")
        # Ensure unique slug
        base_slug = slug
        counter = 1
        while self.provider_repo.get_by_slug(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        provider = Provider(
            user_id=user.id,
            slug=slug,
            name=provider_in.name,
            category=provider_in.category,
            city=provider_in.city,
            tagline=provider_in.tagline,
            bio=provider_in.bio
        )
        return self.provider_repo.create(provider)
