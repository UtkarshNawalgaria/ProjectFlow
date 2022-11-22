from django.urls import path

from .views import UserRegistrationView, UserLoginView, user_details

app_name = "users"

urlpatterns = [
    path("signup/", UserRegistrationView.as_view(), name="signup"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("me", user_details, name="me"),
]
