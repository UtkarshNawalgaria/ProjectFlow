from datetime import datetime
from enum import Enum
from typing import List

from sqlmodel import Field, Relationship

from db.base import BaseModel
from user.models import Profile


class TaskStatus(Enum):
    CREATED = 0
    COMPLETED = 1


class Project(BaseModel, table=True):
    title: str = Field(nullable=False, max_length=100)
    profile_id: int = Field(default=None, foreign_key="profile.id")

    # Relationships
    profile: Profile = Relationship(back_populates="projects")
    lists: List["TaskList"] = Relationship(back_populates="project")


class TaskList(BaseModel, table=True):
    title: str = Field(nullable=False, default="No Title", max_length=50)
    project_id: int = Field(default=None, foreign_key="project.id")

    # Relationships
    project: Project = Relationship(back_populates="lists")
    tasks: List["Task"] = Relationship(back_populates="tasklist")


class Task(BaseModel, table=True):
    title: str = Field(nullable=False, default="My Task", max_length=100)
    description: str = Field(nullable=True, max_length=500)
    status: TaskStatus = Field(default=TaskStatus.CREATED)

    # DateTime fields
    completed_at: datetime = Field(nullable=True)

    # Relationships
    tasklist_id: int = Field(default=None, foreign_key="tasklist.id")
    tasklist: TaskList = Relationship(back_populates="tasks")
