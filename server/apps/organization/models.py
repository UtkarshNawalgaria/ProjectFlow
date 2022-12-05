from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from django_extensions.db.models import TimeStampedModel
from django_extensions.db.fields import AutoSlugField


User = get_user_model()


class Organization(TimeStampedModel):
    title = models.CharField(max_length=50, default="My Organization")
    slug = AutoSlugField(populate_from=["title"])
    users = models.ManyToManyField(
        User, related_name="organizations", through="OrganizationUsers"
    )

    def __str__(self):
        return f"Organization({self.title})"

    @property
    def owner(self) -> User:
        """
        Return User who has "admin" role in the organization
        """

        objs = OrganizationUsers.objects.filter(
            organization=self, role=OrganizationUsers.ADMIN
        )

        return objs[0].user

    @property
    def members(self) -> list[User]:
        return self.users.all()

    @staticmethod
    def is_member(organization_id: int, user: User) -> bool:
        org = Organization.objects.filter(id=organization_id)

        if not org:
            raise ValueError("Organization does not exist")

        return user in org.users.all()

    def get_role(self, user: User) -> str:
        org_user = OrganizationUsers.objects.filter(organization=self, user=user)

        if not org_user.exists():
            raise ValueError("User is not part of the organization")

        return org_user.first().role


class OrganizationUsers(models.Model):
    ADMIN = "admin"
    MEMBER = "member"

    USER_ROLE = [(ADMIN, "Admin"), (MEMBER, "Member")]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=USER_ROLE, default=ADMIN)

    class Meta:
        unique_together = ("organization", "user")
        verbose_name_plural = "Organization Users"

    def __str__(self):
        return f"{self.organization.title} - {self.user.email} - {self.role}"
