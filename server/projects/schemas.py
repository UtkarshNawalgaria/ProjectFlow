from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class TaskRead(SQLModel):
    id: int
    tasklist_id: Optional[int]
    title: str
    description: str
    start_date: Optional[datetime]
    due_date: Optional[datetime]


class TaskCreate(SQLModel):
    project_id: int
    tasklist_id: Optional[int]
    title: str
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
