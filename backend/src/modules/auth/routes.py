from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_user
from src.schemas.domain import UserCreate, UserLogin, UserOut, Token
from src.repositories.user_repo import UserRepository
from src.services.auth_service import AuthService
from src.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db))

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, service: AuthService = Depends(get_auth_service)):
    return service.register_user(user_in)

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, service: AuthService = Depends(get_auth_service)):
    return service.authenticate_user(user_in)

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
