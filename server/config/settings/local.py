from .base import *

DEBUG = True

INTERNAL_IPS = ["127.0.0.1"]

INSTALLED_APPS += ["debug_toolbar"]

CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:4173"]
