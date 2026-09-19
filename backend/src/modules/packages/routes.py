from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_provider
from src.schemas.domain import PackageCreate, PackageUpdate, PackageOut
from src.repositories.package_repo import PackageRepository
from src.services.package_service import PackageService
from src.models import Provider

from typing import List

router = APIRouter(prefix="/packages", tags=["packages"])

def get_package_service(db: Session = Depends(get_db)) -> PackageService:
    return PackageService(PackageRepository(db))

@router.get("", response_model=List[PackageOut])
def list_packages(
    provider: Provider = Depends(get_current_provider),
    service: PackageService = Depends(get_package_service)
):
    return service.get_packages(provider)

@router.post("", response_model=PackageOut, status_code=status.HTTP_201_CREATED)
def create_package(
    data: PackageCreate,
    provider: Provider = Depends(get_current_provider),
    service: PackageService = Depends(get_package_service)
):
    return service.create_package(provider, data)

@router.put("/{package_id}", response_model=PackageOut)
def update_package(
    package_id: int,
    data: PackageUpdate,
    provider: Provider = Depends(get_current_provider),
    service: PackageService = Depends(get_package_service)
):
    return service.update_package(provider, package_id, data)

@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_package(
    package_id: int,
    provider: Provider = Depends(get_current_provider),
    service: PackageService = Depends(get_package_service)
):
    service.delete_package(provider, package_id)
