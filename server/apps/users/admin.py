from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.
from .forms import CustomUserCreationform, CustomUserChangeform
from .models import OrganizationInvitation, User


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


class OrganizationInvitationAdmin(admin.ModelAdmin):
    model = OrganizationInvitation
    list_display = ("email", "invited_by", "organization", "sent_at", "accepted_at")
    readonly_fields = (
        "email",
        "invited_by",
        "organization",
        "invitation_code",
        "accepted_at",
        "sent_at",
    )


admin.site.register(User, CustomUserAdmin)
admin.site.register(OrganizationInvitation, OrganizationInvitationAdmin)
