from typing import Optional
from sqlmodel import SQLModel
from pydantic import EmailStr


class UserCreate(SQLModel):
    name: Optional[str]
    email: EmailStr
    password: str


class UserRead(SQLModel):
    id: int
    email: EmailStr


class ProfileRead(SQLModel):
    id: int
    user: UserRead
