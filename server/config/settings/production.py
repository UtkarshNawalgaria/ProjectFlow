from .base import *

DEBUG = False

ALLOWED_HOSTS = ["utkarshnawalgaria.com"]

DATABASES["default"] = {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": env("POSTGRES_DB"),
    "USER": env("POSTGRES_USER"),
    "PASSWORD": env("POSTGRES_PASSWORD"),
    "HOST": env("POSTGRES_HOST"),
    "PORT": env("POSTGRES_PORT"),
}

# Email Backend
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_USER", default="")
DEFAULT_FROM_EMAIL = "mail@utkarshnawalgaria.com"

CORS_ALLOWED_ORIGINS = ["https://tasks.utkarshnawalgaria.com"]

# Production checks
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
