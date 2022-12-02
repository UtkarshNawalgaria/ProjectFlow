from django.urls import path


from .views import OrganizationListView, organization_members

app_name = "organization"

urlpatterns = [
    path("", OrganizationListView.as_view(), name="list"),
    path("<int:pk>/members/", organization_members, name="members"),
]
