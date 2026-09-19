from fastapi import HTTPException, status
from src.repositories.package_repo import PackageRepository
from src.models import Package, Provider
from src.schemas.domain import PackageCreate, PackageUpdate

class PackageService:
    def __init__(self, package_repo: PackageRepository):
        self.package_repo = package_repo

    def get_packages(self, provider: Provider) -> list[Package]:
        return self.package_repo.get_by_provider_id(provider.id)

    def create_package(self, provider: Provider, data: PackageCreate) -> Package:
        if not provider:
            raise HTTPException(status_code=403, detail="Only providers can create packages")
        package = Package(
            provider_id=provider.id,
            name=data.name,
            duration=data.duration,
            price=data.price,
            features=data.features,
            is_active=True
        )
        return self.package_repo.create(package)

    def update_package(self, provider: Provider, package_id: int, data: PackageUpdate) -> Package:
        package = self.package_repo.get_by_id(package_id)
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        if package.provider_id != provider.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(package, key, value)
            
        return self.package_repo.update(package)

    def delete_package(self, provider: Provider, package_id: int) -> None:
        package = self.package_repo.get_by_id(package_id)
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        if package.provider_id != provider.id:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        self.package_repo.delete(package)
