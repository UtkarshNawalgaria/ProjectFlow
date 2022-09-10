from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str


@lru_cache
def get_settings():
    return Settings()
