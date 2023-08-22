import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    ".utkarshnawalgaria.com",
    "task-management-production.up.railway.app"
]
CORS_ALLOWED_ORIGINS = (
    "https://tasks.utkarshnawalgaria.com",
    "https://api-tasks.utkarshnawalgaria.com",
)
CSRF_TRUSTED_ORIGINS = ["https://api-tasks.utkarshnawalgaria.com"]

DATABASES["default"] = {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": env("POSTGRES_DB"),
    "USER": env("POSTGRES_USER"),
    "PASSWORD": env("POSTGRES_PASSWORD"),
    "HOST": env("POSTGRES_HOST"),
    "PORT": env("POSTGRES_PORT"),
}

# AWS Settings
AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}

# STATIC
AWS_STATIC_LOCATION = "static"
STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_STATIC_LOCATION}/"
STATICFILES_STORAGE = "libs.storage_backends.StaticStorage"

# Media
AWS_MEDIA_LOCATION = "media"
MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_MEDIA_LOCATION}/"
DEFAULT_FILE_STORAGE = "libs.storage_backends.MediaStorage"


# Production checks
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
HTTPS_ENABLED = True

if env("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=env("SENTRY_DSN"),
        integrations=[
            DjangoIntegration(),
        ],
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=0.5,
        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True,
    )
