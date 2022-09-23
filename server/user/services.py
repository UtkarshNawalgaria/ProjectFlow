import jwt
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, select

from config import get_settings
from logger import log

from .models import User


settings = get_settings()


def authenticate_user(email: str, password: str, db: Session) -> Optional[User]:
    user = db.exec(select(User).where(User.email == email)).one_or_none()

    if not user or not user.verify_password(password):
        return False

    return user


def create_access_token(
    *, subject: str, expire_in_min: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES
) -> str:
    jwt_payload = {}
    expiration = datetime.utcnow() + timedelta(minutes=expire_in_min)
    jwt_payload["exp"] = expiration
    jwt_payload["iat"] = datetime.utcnow()
    jwt_payload["sub"] = str(subject)

    return jwt.encode(jwt_payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)


def verify_access_token(*, token: str):
    try:
        jwt.decode(
            token,
            key=settings.JWT_SECRET,
            algorithms=[
                settings.ALGORITHM,
            ],
        )
        return True
    except jwt.exceptions.ExpiredSignatureError as error:
        log.error(f"User token expired, error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your access token has expired. Please login again.",
        )
    except Exception as error:
        log.error(error)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token"
        )
