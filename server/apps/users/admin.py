from django.contrib.auth import get_user_model
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.
from .forms import CustomUserCreationform, CustomUserChangeform

User = get_user_model()


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationform
    form = CustomUserChangeform
    model = User

    list_display = ("email", "email_verified_at", "is_superuser")
    fieldsets = (
        (
            None,
            {
                "fields": ("email", "password"),
            },
        ),
        (
            "Permissions",
            {
                "fields": ("is_active", "is_staff", "is_superuser"),
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff"),
            },
        ),
    )
    list_filter = ("email",)
    search_fields = ("email",)
    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)
