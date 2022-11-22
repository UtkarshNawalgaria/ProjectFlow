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

    def is_member(self, user: User) -> bool:
        return user in self.users.all()

    def get_role(self, user: User) -> str:
        return ""


class OrganizationUsers(models.Model):
    ADMIN = "admin"
    MEMBER = "member"

    USER_ROLE = [(ADMIN, "Admin"), (MEMBER, "Member")]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=USER_ROLE, default=ADMIN)

    class Meta:
        unique_together = ("organization", "user")
