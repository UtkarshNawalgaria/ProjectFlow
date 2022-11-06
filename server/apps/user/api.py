from datetime import datetime
from typing import List
from passlib.hash import bcrypt

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from db.config import get_db_session
from auth import oauth2_scheme
from logger import log
from config import get_settings

from .models import Organization, OrganizationRole, OrganizationUsers, User, InvitedUser
from .schemas import (
    AcceptInvitationSuccess,
    AcceptInvite,
    PasswordReset,
    Success,
    UserInvite,
    UserRead,
    UserCreate,
    VerifyEmail,
)
from .services import (
    authenticate_user,
    create_access_token,
    generate_user_invite_url,
    generate_verification_code_and_url,
    get_current_user,
    send_user_invitation,
    verify_access_token,
    send_verification_email,
)

auth_router = APIRouter(prefix="/auth", tags=["auth"])
user_router = APIRouter(
    prefix="/user", dependencies=[Depends(oauth2_scheme)], tags=["user"]
)

settings = get_settings()


@auth_router.post("/register/", status_code=201)
async def user_signup(user_in: UserCreate, session: Session = Depends(get_db_session)):
    existing_user = session.exec(
        select(User).where(User.email == user_in.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with email already exists.",
        )

    verification_code, verification_url = generate_verification_code_and_url()

    # Create new user
    new_user = User(
        name=user_in.name or "User",
        email=user_in.email,
        hash=verification_code,
    )
    new_user.set_password(user_in.password)

    # Create user organization
    organization = Organization(title="My Organization", users=[new_user])

    session.add(new_user)
    session.add(organization)
    session.commit()
    session.refresh(new_user)

    await send_verification_email(new_user, verification_url)

    return Success(
        message="A verification email has been sent to you. Please verify and then login"
    )


@auth_router.post("/login/", status_code=201)
def user_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db_session),
):
    my_user = authenticate_user(form_data.username, form_data.password, session)

    if not my_user:
        log.info(f"{form_data.username} either does not exist or passowrd is wrong")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    if not my_user.email_verified_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please verify your email first to login.",
        )

    token = create_access_token(subject=my_user.email)

    return {"access_token": token, "token_type": "bearer"}


@auth_router.post("/verify_access_token/", status_code=status.HTTP_202_ACCEPTED)
def verify_token(access_token: str = Depends(oauth2_scheme)):
    verify_access_token(token=access_token)
    return {"access_token": access_token}


@auth_router.post("/verify_email/")
def verify_email(verify_data: VerifyEmail, session: Session = Depends(get_db_session)):
    ERROR_MESSAGE = "Invalid verification code or account already verified"

    user = session.exec(
        select(User).where(
            User.email == verify_data.email, User.hash == verify_data.code
        )
    ).one_or_none()

    if not user or (user and user.email_verified_at):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ERROR_MESSAGE)

    user.email_verified_at = datetime.now()
    user.updated_at = datetime.now()

    session.add(user)
    session.commit()

    return Success(message="User verified successfully")


@auth_router.post("/accept-invite/")
async def accept_invite(
    invite_details: AcceptInvite, session: Session = Depends(get_db_session)
):
    """
    Mark the invitation to the user as accepted and perform the following
    actions -
        1. Create new user with email verified
        2. Create the user's default Organization
        3. Add user to invited Organization as a MEMBER
    """

    invitation = session.exec(
        select(InvitedUser).where(InvitedUser.invite_code == invite_details.code)
    ).one_or_none()

    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have not been invited to join any Organization",
        )

    invitation.accepted_at = datetime.now()

    new_user = User(email=invitation.email, email_verified_at=datetime.now())
    default_organization = Organization(title="My Organization", users=[new_user])
    org_users = OrganizationUsers(
        user=new_user,
        organization_id=invitation.invited_to,
        role=OrganizationRole.MEMBER,
    )

    session.add(invitation)
    session.add(org_users)
    session.add(default_organization)
    session.commit()

    return AcceptInvitationSuccess(
        message="User has accepted the invitation",
        add_new_user=True,
        email=invitation.email,
    )


<<<<<<< HEAD
@user_router.get("/", response_model=List[UserRead], include_in_schema=False)
=======
@user_router.get("/", response_model=List[UserRead])
>>>>>>> 6aa30ffe3d322e5b149ae360f0b7877063de930f
def get_all_users(session: Session = Depends(get_db_session)):
    users = session.exec(select(User)).all()
    return users


@user_router.get("/me/", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return user


@user_router.post("/reset_password/")
def reset_user_password(
    data: PasswordReset,
    session: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    if not user.verify_password(data.current_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"current_password": "Current password entered is wrong"},
        )

    user.password_hash = bcrypt.hash(data.new_password)

    session.add(user)
    session.commit()

    return Success(message="Password reset successfully")


@user_router.post("/send-invite/", status_code=status.HTTP_200_OK)
async def send_user_invite(
    obj: UserInvite,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    """
    Send an invitation email to the invited user's email id.
    """

    user_is_registered = False
    organization = session.exec(
        select(Organization).where(Organization.id == obj.organization_id)
    ).one_or_none()

    # If the invited user email is the same as that of the auth user
    if obj.email == current_user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot invite yourself",
        )

    invitation = session.exec(
        select(InvitedUser).where(
            InvitedUser.email == obj.email, InvitedUser.invited_to == organization.id
        )
    ).one_or_none()

    # Check if user has already been invited to the organization
    if invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{obj.email} has already been invited to {organization.title}",
        )

    existing_user = session.exec(
        select(User).where(User.email == obj.email)
    ).one_or_none()

    if existing_user:
        user_is_registered = True

    invite_code, invitation_url = generate_user_invite_url()
    invited_user = InvitedUser(
        email=obj.email,
        invite_code=invite_code,
        is_registered=user_is_registered,
        invited_by=current_user.id,
        invited_to=obj.organization_id,
        invited_at=datetime.now(),
    )

    session.add(invited_user)
    session.commit()

    await send_user_invitation(
        current_user.name, obj.email, organization.title, invitation_url
    )
    return Success(message=f"User {obj.email} has been sent an invitation link")
