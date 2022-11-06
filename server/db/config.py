from sqlmodel import create_engine, Session

from config import get_settings
from apps.user.models import *
from apps.projects.models import *

settings = get_settings()

engine = create_engine(settings.DATABASE_URL, echo=True)


def get_db_session():
    with Session(engine) as session:
        yield session
