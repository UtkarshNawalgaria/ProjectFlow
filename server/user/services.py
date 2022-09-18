from sqlmodel import Session, select

from .models import User
from .schemas import UserRead

def authenticate_user(email: str, password: str, db: Session) -> UserRead:
    user = db.exec(select(User).where(User.email == email)).one_or_none()

    if not user or not user.verify_password(password):
        return False

    return user
