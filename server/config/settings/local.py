from .base import *

DEBUG = True

INTERNAL_IPS = ["127.0.0.1"]

INSTALLED_APPS += ["debug_toolbar"]

DEFAULT_FROM_EMAIL = "nawalgaria.utkarsh8@gmail.com"

CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:4173"]
