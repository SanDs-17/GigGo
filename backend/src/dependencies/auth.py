from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from src.core.config import settings
from src.dependencies.database import get_db
from src.repositories.user_repo import UserRepository
from src.repositories.provider_repo import ProviderRepository
from src.models import User, Provider

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(user_id))
    if not user:
        raise credentials_exc
    return user

def get_current_provider(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Provider:
    provider_repo = ProviderRepository(db)
    provider = provider_repo.get_by_user_id(current_user.id)
    if not provider:
        raise HTTPException(status_code=403, detail="Provider profile not found")
    return provider
