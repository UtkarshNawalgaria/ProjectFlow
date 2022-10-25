from datetime import datetime
import hashlib
from typing import List
from passlib.hash import bcrypt
from random import randbytes

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from sqlmodel import Session, select

from db.config import get_db_session
from auth import oauth2_scheme
from logger import log
from config import get_settings

from .models import Profile, User
from .schemas import PasswordReset, ProfileRead, UserRead, UserCreate, VerifyEmail
from .services import (
    authenticate_user,
    create_access_token,
    generate_verification_code_and_url,
    get_current_user,
    verify_access_token,
    send_verification_email,
)

auth_router = APIRouter(prefix="/auth", tags=["auth"])
user_router = APIRouter(
    prefix="/user", dependencies=[Depends(oauth2_scheme)], tags=["user"]
)

settings = get_settings()


@auth_router.post("/register/", status_code=201)
async def user_signup(
    user_in: UserCreate, request: Request, session: Session = Depends(get_db_session)
):
    existing_user = session.exec(
        select(User).where(User.email == EmailStr(user_in.email))
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with email already exists.",
        )

    verification_code, verification_url = generate_verification_code_and_url()

    new_user = User(
        name=user_in.name or "User",
        email=user_in.email,
        password_hash=bcrypt.hash(user_in.password),
        hash=verification_code,
    )
    new_user_profile = Profile(user=new_user)

    session.add(new_user_profile)
    session.commit()

    await send_verification_email(new_user, verification_url)

    return {
        "message": "A verification email has been sent to you. Please verify and then login"
    }


@auth_router.post("/login/", status_code=201)
def user_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db_session),
):
    my_user = authenticate_user(form_data.username, form_data.password, session)

    if not my_user:
        log.info(f"{form_data.username} either does not exist or passowrd is wrong")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    if not my_user.email_verified_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please verify your email first to login.",
        )

    token = create_access_token(subject=my_user.email)

    return {"access_token": token, "token_type": "bearer"}


@auth_router.post("/verify_access_token/", status_code=status.HTTP_202_ACCEPTED)
def verify_token(access_token: str = Depends(oauth2_scheme)):
    verify_access_token(token=access_token)
    return {"access_token": access_token}


@auth_router.post("/verify_email/")
def verify_email(verify_data: VerifyEmail, session: Session = Depends(get_db_session)):
    ERROR_MESSAGE = "Invalid verification code or account already verified"

    user = session.exec(
        select(User).where(
            User.email == verify_data.email, User.hash == verify_data.code
        )
    ).one_or_none()

    if not user or (user and user.email_verified_at):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ERROR_MESSAGE)

    user.email_verified_at = datetime.now()
    user.updated_at = datetime.now()

    session.add(user)
    session.commit()

    return {"message": "User verified successfully"}


@user_router.get("/", response_model=List[UserRead], include_in_schema=False)
def get_all_users(session: Session = Depends(get_db_session)):
    users = session.exec(select(User)).all()
    return users


@user_router.get("/me/", response_model=ProfileRead)
def me(user: User = Depends(get_current_user)):
    return user.profile


@user_router.post("/reset_password/")
def reset_user_password(
    data: PasswordReset,
    session: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    if not user.verify_password(data.current_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"current_password": "Current password entered is wrong"},
        )

    user.password_hash = bcrypt.hash(data.new_password)

    session.add(user)
    session.commit()

    return {"message": "Password reset successfully"}
