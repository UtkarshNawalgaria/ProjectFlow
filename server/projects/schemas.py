from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

from .models import TaskStatus


class TaskRead(SQLModel):
    id: int
    title: str
    description: str
    status: TaskStatus
    tasklist_id: Optional[int]
    start_date: Optional[datetime]
    due_date: Optional[datetime]


class TaskCreate(SQLModel):
    project_id: int
    title: str
    status: TaskStatus
    description: Optional[str]
    tasklist_id: Optional[int]
    description: Optional[str]
    start_date: Optional[datetime]
    due_date: Optional[datetime]


class ProjectBase(SQLModel):
    title: str = Field(min_length=3, max_length=50)
    description: Optional[str]


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
    task_count: int = 0


class TaskListCreate(SQLModel):
    title: str
    project_id: int


class TaskListRead(TaskListCreate):
    id: int
