from typing import List
from passlib.hash import bcrypt

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from db.config import get_db_session
from auth import oauth2_scheme
from logger import log
from config import get_settings

from .models import Profile, User
from .schemas import ProfileRead, UserRead, UserCreate
from .services import (
    authenticate_user,
    create_access_token,
    get_current_user,
    verify_access_token,
)

auth_router = APIRouter(prefix="/auth", tags=["auth"])
user_router = APIRouter(
    prefix="/user", dependencies=[Depends(oauth2_scheme)], tags=["user"]
)

settings = get_settings()


@auth_router.post("/register/", status_code=201)
def user_signup(user_in: UserCreate, session: Session = Depends(get_db_session)):

    existing_users = session.exec(select(User).where(User.email == user_in.email)).all()

    if len(existing_users):
        raise HTTPException(status_code=400, detail="User with email already exists.")

    new_user = User(
        name="User", email=user_in.email, password_hash=bcrypt.hash(user_in.password)
    )
    new_user_profile = Profile(user=new_user)

    session.add(new_user_profile)
    session.commit()

    return {"message": "User Created"}


@auth_router.post("/login/")
def user_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db_session),
):
    my_user = authenticate_user(form_data.username, form_data.password, session)

    if not my_user:
        log.info(f"{form_data.username} either does not exists or passowrd is wrong")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(subject=my_user.email)

    return {"access_token": token, "token_type": "bearer"}


@auth_router.post("/verify_access_token", status_code=status.HTTP_202_ACCEPTED)
def verify_token(access_token: str = Depends(oauth2_scheme)):
    verify_access_token(token=access_token)
    return {"access_token": access_token}


@user_router.get("/", response_model=List[UserRead])
def get_all_users(session: Session = Depends(get_db_session)):
    users = session.exec(select(User)).all()
    return users


@user_router.get("/me", response_model=ProfileRead)
def me(user: User = Depends(get_current_user)):
    return user.profile
