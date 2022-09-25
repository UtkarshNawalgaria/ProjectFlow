from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth import oauth2_scheme
from db.config import get_db_session

from user.models import User
from user.services import get_current_user

from .models import Project
from .schemas import ProjectCreate, ProjectRead

projects_router = APIRouter(
    prefix="/project", dependencies=[Depends(oauth2_scheme)], tags=["project"]
)


@projects_router.get("/", response_model=List[Project])
def get_all_projects(user: User = Depends(get_current_user)):
    return user.projects


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


@projects_router.post("/", response_model=Project)
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
