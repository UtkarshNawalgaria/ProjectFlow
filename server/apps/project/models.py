from functools import cached_property
from django.db import models
from django.urls import reverse
from django.contrib.auth import get_user_model

from django_extensions.db.models import TimeStampedModel, TitleSlugDescriptionModel


User = get_user_model()


class Project(TimeStampedModel, TitleSlugDescriptionModel):
    organization = models.ForeignKey(
        "organization.Organization",
        on_delete=models.SET_NULL,
        related_name="projects",
        null=True,
    )
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_projects"
    )
    users = models.ManyToManyField(
        User, related_name="projects", through="ProjectUsers"
    )

    def __str__(self):
        return f"Project(title={self.title})"

    @property
    def members(self) -> list[User]:
        return self.get_users_by_role(ProjectUsers.MEMBER)

    @property
    def admins(self) -> list[User]:
        return self.get_users_by_role(ProjectUsers.ADMIN)

    @property
    def task_count(self):
        return self.tasks.count()

    @cached_property
    def tasklists(self):
        return self.tasklists.all()

    def get_absolute_url(self):
        return reverse("project-detail", kwargs={"pk": self.pk})

    def get_users_by_role(self, role: str) -> list[User]:
        project_users_members = ProjectUsers.objects.filter(
            project_id=self.id, role=role
        ).values_list("user_id", flat=True)

        users = User.objects.filter(id__in=list(project_users_members))

        return users

    def has_permission(self, user: User, action: str = "GET") -> bool:
        if action == "GET":
            return user in self.users

        if action in ["PUT", "DELETE", "PATCH"]:
            return user == self.owner


class TaskList(TimeStampedModel):
    title = models.CharField(max_length=256)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="tasklists"
    )

    class Meta:
        verbose_name_plural = "Task Lists"

    def __str__(self):
        return f"TaskList(title={self.title}, project={self.project.title})"


class Task(TimeStampedModel, TitleSlugDescriptionModel):
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    tasklist = models.ForeignKey(
        TaskList, on_delete=models.SET_NULL, related_name="tasks", null=True
    )
    owner = models.ForeignKey(User, related_name="tasks", on_delete=models.CASCADE)

    def __str__(self):
        return f"Task(title={self.title}, project={self.project.title})"

    def can_delete_or_update(self, user: User) -> bool:
        """
        Only allow project owners to delete/update project tasks.
        """
        return self.owner == user


class ProjectUsers(models.Model):
    ADMIN = "admin"
    MEMBER = "member"

    USER_ROLE = [(ADMIN, "Admin"), (MEMBER, "Member")]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=USER_ROLE, default=ADMIN)

    class Meta:
        unique_together = ("project", "user")
        verbose_name_plural = "Project Users"
