from sqlalchemy.orm import Session
from src.models import Package

class PackageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, package_id: int) -> Package | None:
        return self.db.query(Package).filter(Package.id == package_id).first()

    def get_by_provider_id(self, provider_id: int) -> list[Package]:
        return self.db.query(Package).filter(Package.provider_id == provider_id).all()

    def create(self, package: Package) -> Package:
        self.db.add(package)
        self.db.commit()
        self.db.refresh(package)
        return package

    def update(self, package: Package) -> Package:
        self.db.commit()
        self.db.refresh(package)
        return package

    def delete(self, package: Package) -> None:
        self.db.delete(package)
        self.db.commit()
