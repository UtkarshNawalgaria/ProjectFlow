from django.urls import path


from .views import OrganizationListView

app_name = 'organization'

urlpatterns = [
    path("", OrganizationListView.as_view(), name="list"),
]
