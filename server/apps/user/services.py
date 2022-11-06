import hashlib
import jwt
from random import randbytes
from datetime import datetime, timedelta
from typing import Any, Optional, Dict

from fastapi import HTTPException, status, Depends
from pydantic import EmailStr, HttpUrl
from sqlmodel import Session, select

from auth import oauth2_scheme
from config import get_settings
from db.config import get_db_session
from logger import log

from helpers.email import send_email

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


def generate_hex_code():
    token = randbytes(10)
    hashedCode = hashlib.sha256()
    hashedCode.update(token)
    return hashedCode.hexdigest()


def generate_verification_code_and_url():
    verification_code = generate_hex_code()
    verification_url = (
        f"{settings.APPLICATION_URL}verify_email/?code={verification_code}"
    )

    return verification_code, verification_url


def generate_user_invite_url():
    invite_code = generate_hex_code()
    invitation_url = f"{settings.APPLICATION_URL}user/join/{invite_code}"

    return invite_code, invitation_url


async def send_verification_email(user: User, verification_url: HttpUrl):
    await send_email(
        "email_verification.html",
        "Verify Email Address",
        recipients=[user.email],
        context={
            "name": user.name,
            "email": user.email,
            "verification_url": verification_url,
        },
    )


async def send_user_invitation(
    from_user_name: str,
    recipient: EmailStr,
    organization_name: str,
    invitation_url: HttpUrl,
):
    await send_email(
        "user_invitation.html",
        f"You are invited to {organization_name}",
        recipients=[recipient],
        context={
            "organization": organization_name,
            "invitation_url": invitation_url,
            "from_user_name": from_user_name,
        },
    )