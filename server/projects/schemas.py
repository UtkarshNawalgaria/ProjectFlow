from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class ProjectBase(SQLModel):
    title: str = Field(min_length=3, max_length=50)
    description: Optional[str]


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
