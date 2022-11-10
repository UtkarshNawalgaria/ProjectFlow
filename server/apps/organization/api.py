from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth import oauth2_scheme
from db.config import get_db_session

from apps.user.services import get_current_user
from apps.user.models import User, InvitedUser

from .schemas import OrganizationMember


organization_router = APIRouter(
    prefix="/organization", dependencies=[Depends(oauth2_scheme)], tags=["organization"]
)


@organization_router.get("/{org_id}/members/", response_model=List[OrganizationMember])
def get_organization_members(
    org_id: int,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    current_organization = list(
        filter(lambda org: org.organization_id == org_id, current_user.org_users)
    )

    if not current_organization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to access this resource.",
        )

    invited_users = session.exec(
        select(InvitedUser).where(
            InvitedUser.invited_to == org_id, InvitedUser.invited_by == current_user.id
        )
    ).all()

    return_objs = []
    for user in invited_users:
        return_obj = OrganizationMember.from_orm(user)
        return_obj.invitation_status = "ACCEPTED" if user.accepted_at else "PENDING"
        return_objs.append(return_obj)

    return return_objs
