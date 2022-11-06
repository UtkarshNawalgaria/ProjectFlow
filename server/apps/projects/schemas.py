from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

from .models import TaskStatus


class TaskBase(SQLModel):
    title: str
    project_id: int
    description: Optional[str]
    tasklist_id: Optional[int]
    due_date: Optional[datetime]
    start_date: Optional[datetime]


class TaskRead(TaskBase):
    id: int
    status: TaskStatus


class TaskUpdate(TaskBase):
    title: Optional[str]
    project_id: Optional[int]
    status: Optional[TaskStatus]
    description: Optional[str]
    tasklist_id: Optional[int]
    due_date: Optional[datetime]
    start_date: Optional[datetime]


class TaskCreate(TaskBase):
    title: str = Field(min_length=5)


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
