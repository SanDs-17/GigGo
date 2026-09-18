from fastapi import HTTPException, status
from src.repositories.user_repo import UserRepository
from src.schemas.domain import UserCreate, UserLogin
from src.models import User
from src.utils.security import hash_password, verify_password, create_access_token

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register_user(self, user_in: UserCreate) -> dict:
        if self.user_repo.get_by_email(user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(
            email=user_in.email,
            name=user_in.name,
            hashed_password=hash_password(user_in.password),
            role=user_in.role
        )
        created_user = self.user_repo.create(user)
        access_token = create_access_token(data={"sub": str(created_user.id)})
        return {"access_token": access_token, "token_type": "bearer", "user": created_user}

    def authenticate_user(self, user_in: UserLogin) -> dict:
        user = self.user_repo.get_by_email(user_in.email)
        if not user or not verify_password(user_in.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer", "user": user}
