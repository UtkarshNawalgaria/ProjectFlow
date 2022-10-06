from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth import oauth2_scheme
from db.config import get_db_session

from user.models import User
from user.services import get_current_user

from .models import Project, Task, TaskList
from .schemas import (
    ProjectCreate,
    ProjectRead,
    TaskRead,
    TaskCreate,
    TaskListCreate,
    TaskListRead,
    TaskUpdate,
)

projects_router = APIRouter(
    prefix="/project", dependencies=[Depends(oauth2_scheme)], tags=["project"]
)
tasks_router = APIRouter(
    prefix="/task", dependencies=[Depends(oauth2_scheme)], tags=["task"]
)


@projects_router.get("/", response_model=List[ProjectRead])
def get_all_projects(user: User = Depends(get_current_user)):
    db_projects: List[Project] = user.projects

    if not db_projects:
        return []

    user_projects = []

    for project in db_projects:
        task_count = len(project.tasks)
        return_project = ProjectRead.from_orm(project)
        return_project.task_count = task_count

        user_projects.append(return_project)

    return user_projects


@projects_router.get("/{project_id}/", response_model=ProjectRead)
def get_project_by_id(
    project_id: int,
    session: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    user_project = session.exec(
        select(Project).where(Project.owner == user, Project.id == project_id)
    ).one_or_none()

    if not user_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return user_project


@projects_router.delete("/{project_id}/", status_code=status.HTTP_200_OK)
def delete_project(
    project_id: int,
    session: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    user_project = session.exec(
        select(Project).where(Project.owner == user, Project.id == project_id)
    ).one_or_none()

    if not user_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    session.delete(user_project)
    session.commit()

    return {"detail": "Project Deleted"}


@projects_router.post("/", response_model=ProjectRead)
def create_new_project(
    project: ProjectCreate,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    new_project = Project(**project.dict(), owner=current_user)
    session.add(new_project)
    session.commit()
    session.refresh(new_project)

    return new_project


@tasks_router.get("/", response_model=List[TaskRead])
def get_all_tasks(
    project_id: int,
    session: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    project = session.exec(
        select(Project).where(Project.owner == user, Project.id == project_id)
    ).one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No project found."
        )

    return project.tasks


@tasks_router.post("/", response_model=TaskRead)
def create_task(
    task_create: TaskCreate,
    session: Session = Depends(get_db_session),
):
    new_task = Task(**task_create.dict())
    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    return new_task


@tasks_router.patch("/{task_id}/", response_model=TaskRead)
def update_task(
    task_id: int, task: TaskUpdate, session: Session = Depends(get_db_session)
):
    db_task = session.exec(select(Task).where(Task.id == task_id)).one_or_none()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    new_task_data = task.dict(exclude_unset=True)

    for key, value in new_task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@tasks_router.delete("/{task_id}/", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: int,
    session: Session = Depends(get_db_session),
):
    task = session.exec(select(Task).where(Task.id == task_id)).one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    session.delete(task)
    session.commit()

    return {"detail": "Task Deleted"}


@tasks_router.get("/{task_id}/", response_model=TaskRead)
def get_task_by_id(task_id: int, session: Session = Depends(get_db_session)):

    task = session.exec(select(Task).where(Task.id == task_id)).one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@tasks_router.post("/create_list/", response_model=TaskListRead)
def create_task_list(list: TaskListCreate, session: Session = Depends(get_db_session)):
    new_task_list = TaskList(**list.dict())
    session.add(new_task_list)
    session.commit()
    session.refresh(new_task_list)

    return new_task_list


@tasks_router.get("/get_list", response_model=List[TaskListRead])
def get_task_lists(project_id: int, session: Session = Depends(get_db_session)):
    lists = session.exec(
        select(TaskList).where(TaskList.project_id == project_id)
    ).all()
    return lists
