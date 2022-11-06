from enum import Enum
from passlib.hash import bcrypt
from datetime import datetime
from typing import List, Optional
from pydantic import EmailStr

from sqlmodel import Field, Relationship, SQLModel

from db.base import BaseModel


class OrganizationRole(Enum):
    ADMIN = 0
    MEMBER = 1


class OrganizationUsers(SQLModel, table=True):
    organization_id: Optional[int] = Field(
        default=None, foreign_key="organization.id", primary_key=True
    )
    user_id: Optional[int] = Field(
        default=None, foreign_key="user.id", primary_key=True
    )
    role: OrganizationRole = Field(default=OrganizationRole.ADMIN)

    user: "User" = Relationship(back_populates="org_users")
    organization: "Organization" = Relationship(back_populates="org_users")


class User(BaseModel, table=True):
    name: str = Field(default=None, max_length=100)
    email: str = Field(nullable=False, max_length=100, index=True, unique=True)
    password_hash: str = Field(nullable=True, max_length=128)
    hash: str = Field(nullable=True, max_length=128)

    # Datetime fields
    email_verified_at: datetime = Field(default=None, nullable=True)

    # Relationships
    organizations: List["Organization"] = Relationship(
        back_populates="users", link_model=OrganizationUsers
    )
    org_users: List[OrganizationUsers] = Relationship(back_populates="user")
    projects: Optional[List["Project"]] = Relationship(back_populates="owner")

    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.password_hash)

    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.hash(password)


class Organization(BaseModel, table=True):
    title: str = Field(nullable=False, max_length=100)

    # Relationships
    users: List[User] = Relationship(
        back_populates="organizations", link_model=OrganizationUsers
    )
    org_users: List[OrganizationUsers] = Relationship(back_populates="organization")


class InvitedUser(BaseModel, table=True):
    email: EmailStr = Field(nullable=False)
    invite_code: str = Field(nullable=False, max_length=256)
    invited_at: datetime = Field(default=None, nullable=True)
    accepted_at: datetime = Field(default=None, nullable=True)
    is_registered: bool = Field(default=False)

    invited_by: int = Field(nullable=False, foreign_key="user.id")
    invited_to: int = Field(nullable=False, foreign_key="organization.id")

