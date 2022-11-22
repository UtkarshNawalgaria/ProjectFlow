from django.contrib import admin
from django.conf import settings
from django.urls import path, include

from apps.project.router import router as project_router

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(project_router.urls)),
    path("api-auth/", include("rest_framework.urls")),
    path("api/users/", include("apps.users.urls", namespace="user")),
    path(
        "api/organization/", include("apps.organization.urls", namespace="organization")
    ),
]

if settings.ENV_MODE == "local":
    urlpatterns += [
        path("__debug__/", include("debug_toolbar.urls")),
    ]
