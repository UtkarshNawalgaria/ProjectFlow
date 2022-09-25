import jwt
from datetime import datetime, timedelta
from typing import Any, Optional, Dict

from fastapi import HTTPException, status, Depends
from sqlmodel import Session, select

from auth import oauth2_scheme
from config import get_settings
from db.config import get_db_session
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


def decode_token(*, token: str) -> Dict[str, Any]:
    user_data = jwt.decode(
        token,
        key=settings.JWT_SECRET,
        algorithms=[
            settings.ALGORITHM,
        ],
    )

    return user_data


def get_current_user(
    session: Session = Depends(get_db_session),
    token: str = Depends(oauth2_scheme),
) -> Optional[User]:
    verify_access_token(token=token)

    user_data = decode_token(token=token)

    user = session.exec(
        select(User).where(User.email == user_data["sub"])
    ).one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid auth credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
