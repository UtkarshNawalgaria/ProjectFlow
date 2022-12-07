from django.db import models
from django.conf import settings
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

from django_extensions.db.models import TimeStampedModel

from services.email import send_email


class UserManager(BaseUserManager):
    use_in_migrations: bool = True

    def _create_user(self, email, password, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email: str, password: str = None, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str, **extra_fields):
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self._create_user(email, password, **extra_fields)

    def verified_users(self):
        """
        Return all users who have verified their emails
        """
        return self.filter(email_verified_at__isnull=False)

    def valid_users(self):
        """
        Return only users who are active and not superuser or staff user.
        """

        Q = models.Q

        filter_query = Q(
            Q(is_superuser=False, is_active=True) | Q(is_staff=False, is_active=True)
        )
        return self.filter(filter_query)


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    email = models.EmailField(_("email address"), max_length=254, unique=True)
    name = models.CharField(_("name"), max_length=100, blank=True)
    verification_code = models.CharField(
        _("account verification code"), max_length=256, blank=True
    )

    date_joined = models.DateTimeField(_("date joined"), auto_now_add=True)
    email_verified_at = models.DateTimeField(_("email verified at"), null=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"User(email={self.email})"

    def send_account_activation_email(self):
        context = {
            "name": self.name,
            "verification_link": f"{settings.APPLICATION_URL}verify/?code={self.verification_code}",
        }

        send_email(
            to=[self.email],
            template="email/users/account-activation.html",
            subject="Activate Your Account!!",
            context=context,
        )


class OrganizationInvitation(models.Model):
    email = models.EmailField(_("email address"), max_length=254)
    invitation_code = models.CharField(max_length=256, unique=True)
    sent_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True)
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    organization = models.ForeignKey(
        "organization.Organization",
        on_delete=models.CASCADE,
        related_name="invitations",
    )

    def __str__(self):
        return f"InvitedUser(email={self.email})"

    class Meta:
        unique_together = ("email", "invited_by", "organization")

    def send_invitation_email(self):
        context = {
            "email": self.email,
            "organization_name": self.organization.title,
            "invitation_link": f"{settings.APPLICATION_URL}accept-invite/{self.invitation_code}",
        }

        send_email(
            to=[self.email],
            subject=f"Invitation to {self.organization.title}",
            template="email/organization/user-invitation.html",
            context=context,
        )
