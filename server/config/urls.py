from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

from django.views.generic import RedirectView

from apps.project.router import router as project_router

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(project_router.urls)),
    path("api/users/", include("apps.users.urls", namespace="user")),
    path(
        "api/organization/", include("apps.organization.urls", namespace="organization")
    ),
    path("", RedirectView.as_view(url="/api/")),
]

if settings.ENV_MODE == "local":
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
        path("api-auth/", include("rest_framework.urls")),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
