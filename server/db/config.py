from sqlmodel import create_engine, Session, SQLModel

from config import get_settings
from user.models import *
from projects.models import *

settings = get_settings()

engine = create_engine(settings.DATABASE_URL, echo=True)


def init_db():
    print(f"Connecting to database...")

    with engine.begin() as conn:
        conn.run_callable(SQLModel.metadata.create_all)

    print(f"Connected to database successfully.")


def get_db_session():
    with Session(engine) as session:
        yield session
