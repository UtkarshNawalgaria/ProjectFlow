from pydantic import EmailStr
from sqlmodel import SQLModel


class OrganizationMember(SQLModel):
    name: str = ""
    email: EmailStr
    invitation_status: str = "PENDING"
    role: str = "MEMBER"
