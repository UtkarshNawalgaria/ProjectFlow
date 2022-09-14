import sqlalchemy as _sql
from sqlalchemy import create_engine
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as orm

from config import get_settings

settings = get_settings()

engine = create_engine(settings.DATABASE_URL)

SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

_Base = _declarative.declarative_base()


class Base(_Base):
    id = _sql.Column(_sql.Integer, primary_key=True)

    @_declarative.declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


def check_db():
    try:
        print(f"Connecting to database...")
        engine.execute("SELECT 1;")
        print(f"Connected to database successfully.")
    except Exception as e:
        print(f"Database Error: {e}.")
