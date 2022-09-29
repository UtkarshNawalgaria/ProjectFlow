from enum import Enum
from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship

from db.base import BaseModel
from user.models import User


class TaskStatus(Enum):
    OPEN = 0
    COMPLETE = 1


class Project(BaseModel, table=True):
    title: str = Field(nullable=False, max_length=100)
    description: str = Field(nullable=True, max_length=500)
    owner_id: int = Field(default=None, foreign_key="user.id", nullable=False)

    # Relationships
    owner: User = Relationship(back_populates="projects")
    lists: List["TaskList"] = Relationship(back_populates="project")
    tasks: List["Task"] = Relationship(back_populates="project")


class TaskList(BaseModel, table=True):
    title: str = Field(nullable=False, default="No Title", max_length=50)
    project_id: int = Field(default=None, foreign_key="project.id", nullable=False)

    # Relationships
    project: Project = Relationship(back_populates="lists")
    tasks: List["Task"] = Relationship(back_populates="tasklist")


class Task(BaseModel, table=True):
    title: str = Field(nullable=False, default="My Task", max_length=100)
    description: str = Field(nullable=True, max_length=500)
    status: TaskStatus = Field(default=TaskStatus.OPEN)
    project_id: int = Field(nullable=False, foreign_key="project.id")
    tasklist_id: Optional[int] = Field(foreign_key="tasklist.id", nullable=True)

    # DateTime fields
    start_date: datetime = Field(nullable=True)
    due_date: datetime = Field(nullable=True)

    # Relationships
    project: Project = Relationship(back_populates="tasks")
    tasklist: TaskList = Relationship(back_populates="tasks")
