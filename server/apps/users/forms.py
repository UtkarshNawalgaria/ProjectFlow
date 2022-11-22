from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


class CustomUserCreationform(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ("email",)


class CustomUserChangeform(UserChangeForm):
    class Meta:
        model = get_user_model()
        fields = ("email",)
