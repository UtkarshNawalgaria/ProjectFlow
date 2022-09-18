from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Task Management"
    PROJECT_VERSION: str = "0.0.1"

    DATABASE_URL: str
    JWT_SECRET: str


@lru_cache
def get_settings():
    return Settings()
