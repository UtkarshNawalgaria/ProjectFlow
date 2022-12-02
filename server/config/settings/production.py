from .base import *

DEBUG = False

ALLOWED_HOSTS = ["utkarshnawalgaria.com", "localhost"]

DATABASES["default"] = {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": env("POSTGRES_DB"),
    "USER": env("POSTGRES_USER"),
    "PASSWORD": env("POSTGRES_PASSWORD"),
    "HOST": env("POSTGRES_HOST"),
    "PORT": env("POSTGRES_PORT"),
}

# Email Backend
DEFAULT_FROM_EMAIL = "mail@utkarshnawalgaria.com"

CORS_ALLOWED_ORIGINS = ["https://tasks.utkarshnawalgaria.com", "http://localhost:4173"]

# Production checks
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
