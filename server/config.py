from functools import lru_cache
from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Task Management"
    PROJECT_VERSION: str = "0.0.1"

    DATABASE_URL: str = ""

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 2
    JWT_SECRET: str = ""
    ALGORITHM: str = "HS256"
    APPLICATION_URL: str = ""
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    EMAIL_FROM: str = "Tasks Manager"
    EMAIL_PORT: int = 1025
    EMAIL_SERVER: str = "mailhog"
    EMAIL_USE_SSL: bool = True
    EMAIL_USE_CREDENTIALS: bool = True


@lru_cache
def get_settings():
    return Settings()
