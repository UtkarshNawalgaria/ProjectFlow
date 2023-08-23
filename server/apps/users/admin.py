from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin

# Register your models here.
from .forms import CustomUserCreationform, CustomUserChangeform
from .models import OrganizationInvitation, User


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationform
    form = CustomUserChangeform
    model = User

    list_display = ("name", "email", "email_verified_at", "is_superuser")
    fieldsets = (
        (
            None,
            {
                "fields": ("name", "email", "password"),
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
    list_filter = ("is_superuser", "email_verified_at")
    search_fields = ("email",)
    ordering = ("email",)
    actions = ["send_verification_email"]

    @admin.action(description="Send Verification Email")
    def send_verification_email(self, request, queryset):
        error = None

        if queryset.count() > 1:
            error = "Select one user at a time to send verification email"

        user = queryset[0]

        if user.email_verified_at:
            error = "Cannot send verification email to verified user."

        if error:
            return self.message_user(request, error, messages.ERROR)

        user.send_account_activation_email()

        return self.message_user(
            request, f"Verification Email sent to {user.email}", messages.SUCCESS
        )


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
