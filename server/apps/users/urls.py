from django.urls import path

from .views import (
    UserRegistrationView,
    UserLoginView,
    OrganizationSendInvitationView,
    user_details,
    accept_user_invitation,
    invited_user_join,
    verify_account,
)

app_name = "users"

urlpatterns = [
    path("me/", user_details, name="me"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("signup/", UserRegistrationView.as_view(), name="signup"),
    path("send-invite/", OrganizationSendInvitationView.as_view(), name="send-invite"),
    path("verify/<str:code>/", verify_account, name="verify-account"),
    path("accept-invite/<str:code>/", accept_user_invitation, name="accept-invite"),
    path("join/<str:code>/", invited_user_join, name="join"),
]
