from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship

from .base import BaseModel


class User(BaseModel, table=True):
    name: str = Field(default=None, max_length=100)
    email: str = Field(max_length=100, index=True, unique=True)
    password_hash: str = Field(nullable=False)

    # Datetime fields
    email_verified_at: datetime = Field()

    profile: Optional["Profile"] = Relationship(back_populates="user")


class Profile(BaseModel, table=True):
    user_id: int = Field(default=None, foreign_key="user.id")

    user: User = Relationship(back_populates="profile")
    projects: List["Project"] = Relationship(back_populates="profile")
