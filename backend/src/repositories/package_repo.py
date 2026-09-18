from sqlalchemy.orm import Session
from src.models import Package

class PackageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, package_id: int) -> Package | None:
        return self.db.query(Package).filter(Package.id == package_id).first()
