from typing import List, Optional
from sqlmodel import SQLModel
from pydantic import EmailStr, validator


class UserCreate(SQLModel):
    name: Optional[str]
    email: EmailStr
    password: str


class OrganizationRead(SQLModel):
    id: int
    title: str


class UserRead(SQLModel):
    id: int
    name: str = ""
    email: EmailStr
    organizations: List[OrganizationRead]


class PasswordReset(SQLModel):
    current_password: str
    new_password: str
    new_password_confirm: str

    @validator("new_password_confirm", pre=True)
    def validate_new_passwords(cls, new_password_confirm, values):
        if new_password_confirm != values["new_password"]:
            raise ValueError("New password and confirm password don't match")

        return new_password_confirm


class VerifyEmail(SQLModel):
    email: EmailStr
    code: str


class UserInvite(SQLModel):
    email: EmailStr
    organization_id: int


class AcceptInvite(SQLModel):
    code: str


class Success(SQLModel):
    message: str


class AcceptInvitationSuccess(Success):
    add_new_user: bool = False
    email: EmailStr
