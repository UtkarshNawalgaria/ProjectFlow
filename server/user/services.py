import jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Session, select

from config import get_settings

from .models import User


settings = get_settings()


def authenticate_user(email: str, password: str, db: Session) -> Optional[User]:
    user = db.exec(select(User).where(User.email == email)).one_or_none()

    if not user or not user.verify_password(password):
        return False

    return user


def create_access_token(
    *,
    subject: str,
    token_type: str = "access_token",
    expire_in_min: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES
) -> str:
    jwt_payload = {}
    expiration = datetime.utcnow() + timedelta(minutes=expire_in_min)
    jwt_payload["type"] = token_type

    jwt_payload["exp"] = expiration
    jwt_payload["iat"] = datetime.utcnow()
    jwt_payload["sub"] = str(subject)

    return jwt.encode(jwt_payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
