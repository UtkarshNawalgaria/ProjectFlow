from passlib.hash import bcrypt
from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship

from db.base import BaseModel


class User(BaseModel, table=True):
    name: str = Field(default=None, max_length=100)
    email: str = Field(max_length=100, index=True, unique=True)
    password_hash: str = Field(nullable=False, max_length=128)
    hash: str = Field(nullable=True, max_length=128)

    # Datetime fields
    email_verified_at: datetime = Field(nullable=True)

    profile: Optional["Profile"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"uselist": False}
    )
    projects: Optional[List["Project"]] = Relationship(back_populates="owner")

    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.password_hash)


class Profile(BaseModel, table=True):
    user_id: int = Field(default=None, foreign_key="user.id")
    user: User = Relationship(back_populates="profile")
