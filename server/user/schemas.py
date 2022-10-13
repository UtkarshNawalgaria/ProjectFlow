from typing import Optional
from sqlmodel import SQLModel
from pydantic import EmailStr, validator


class UserCreate(SQLModel):
    name: Optional[str]
    email: EmailStr
    password: str


class UserRead(SQLModel):
    id: int
    name: str
    email: EmailStr
    hash: Optional[str]


class ProfileRead(SQLModel):
    id: int
    user: UserRead


class PasswordReset(SQLModel):
    current_password: str
    new_password: str
    new_password_confirm: str

    @validator("new_password_confirm", pre=True)
    def validate_new_passwords(cls, new_password_confirm, values):
        if new_password_confirm != values['new_password']:
            raise ValueError("New password and confirm password don't match")

        return new_password_confirm


class VerifyEmail(SQLModel):
    email: EmailStr
    code: str
