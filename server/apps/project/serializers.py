from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.users.serializers import LimitedUserDetailSerializer
from apps.organization.models import Organization

from .models import Project, ProjectUsers, Task, TaskList


User = get_user_model()


class TasklistListCreateSerailzer(serializers.ModelSerializer):
    class Meta:
        model = TaskList
        fields = (
            "id",
            "title",
            "project",
        )


class ProjectListCreateSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        lookup_field="pk", view_name="project-detail"
    )
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all()
    )

    class Meta:
        model = Project
        fields = (
            "id",
            "url",
            "title",
            "description",
            "organization",
            "owner",
        )

    def validate_organization(self, organization):
        """
        Only allow organization users to create project for their organization.
        """

        auth_user = self.context["user"]
        organization_users = organization.members

        if auth_user not in organization_users:
            raise serializers.ValidationError("User is not part of the organization")

        return organization

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["task_count"] = instance.tasks.filter(
            parent__isnull=True
        ).count()
        return representation

    def create(self, validated_data):
        title = validated_data.get("title")
        description = validated_data.get("description")
        organization = validated_data.get("organization")
        project_owner = self.context.get("user")

        new_project = Project.objects.create(
            title=title,
            description=description,
            owner=project_owner,
            organization=organization,
        )
        new_project.users.add(project_owner)

        return new_project


class AbstractTasksSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        lookup_field="pk", view_name="task-detail"
    )

    class Meta:
        model = Task
        abstract = True
        fields = (
            "id",
            "url",
            "title",
            "description",
            "priority",
            "start_date",
            "end_date",
            "project",
            "tasklist",
            "owner",
            "parent",
        )


class TasksReadSerializer(AbstractTasksSerializer):
    tasklist = TasklistListCreateSerailzer(read_only=True)

    class Meta(AbstractTasksSerializer.Meta):
        abstract = False


class TasksWriteUpdateSerializer(AbstractTasksSerializer):
    class Meta(AbstractTasksSerializer.Meta):
        abstract = False
        fields = AbstractTasksSerializer.Meta.fields + ("tasklist_id",)

    def validate_project(self, project):
        auth_user = self.context["user"]

        if project not in auth_user.projects.all():
            raise serializers.ValidationError("You do not have access to the project")

        return project

    def validate_start_date(self, start_date):
        task = self.instance

        if not task:
            return start_date

        if task.end_date and start_date > task.end_date:
            raise serializers.ValidationError(
                {"start_date": "Start date cannot be after the end date"}
            )

        return start_date

    def validate_end_date(self, end_date):
        task = self.instance

        if not task:
            return end_date

        if task.start_date and end_date < task.start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before the start date"}
            )

        return end_date


class ProjectUsersSerializer(serializers.ModelSerializer):
    user = LimitedUserDetailSerializer()
    role = serializers.CharField()

    class Meta:
        model = ProjectUsers
        fields = (
            "role",
            "user",
        )


class ProjectDetailSerializer(serializers.ModelSerializer):
    tasks = TasksWriteUpdateSerializer(read_only=True, many=True)
    tasklists = TasklistListCreateSerailzer(read_only=True, many=True)
    assigned_users = ProjectUsersSerializer(
        many=True, read_only=True, source="projectusers_set"
    )

    class Meta:
        model = Project
        fields = (
            "id",
            "slug",
            "title",
            "description",
            "tasklists",
            "tasks",
            "owner",
            "assigned_users",
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["task_count"] = instance.tasks.filter(
            parent__isnull=True
        ).count()
        return representation

    def get_value(self, dictionary):
        return super().get_value(dictionary)


class AddUserToProjectSerializer(serializers.Serializer):
    user = serializers.IntegerField(required=True)
    role = serializers.ChoiceField(choices=[("admin", "Admin"), ("member", "Member")])

    class Meta:
        fields = ("user", "role")

    def validate_user(self, user):
        """
        Raise error if the below conditions are met -
        1. User is a superuser
        2. User is inactive
        3. User is not part of the authenticated user's organization
        """

        existing_user = User.objects.filter(id=user).first()

        if (
            not existing_user
            or existing_user.is_superuser
            or not existing_user.is_active
        ):
            raise serializers.ValidationError("Invalid User")

        auth_user = self.context["user"]
        auth_user_organizations = auth_user.organizations.all()
        existing_user_organizations = existing_user.organizations.all()

        if not (auth_user_organizations & existing_user_organizations):
            raise serializers.ValidationError(
                "This user has not been invited the organization"
            )

        return user

    def save(self, **kwargs):
        user_id = self.validated_data["user"]
        role = self.validated_data["role"]
        project_id = kwargs.get("project_id")

        obj = ProjectUsers.objects.create(
            project_id=project_id, user_id=user_id, role=role
        )

        return obj.user


class AssignUserToTaskSerializer(serializers.Serializer):
    project_id = serializers.IntegerField(required=True)
    task_id = serializers.IntegerField(required=True)
    user_id = serializers.IntegerField(required=True)

    class Meta:
        fields = (
            "project_id",
            "task_id",
            "user_id",
        )

    def validate(self, attrs):
        auth_user = self.context["user"]
        user_id = attrs.get("user_id")
        task_id = attrs.get("task_id")
        project_id = attrs.get("project_id")

        user = User.objects.valid_users().filter(id=user_id).first()

        if not user:
            raise serializers.ValidationError({"user_id": "This user does not exist"})

        project = Project.objects.filter(id=project_id).first()

        if not project:
            raise serializers.ValidationError(
                {"project_id": "This project does not exist"}
            )

        project_users = project.users.all()

        if auth_user not in project_users:
            raise serializers.ValidationError(
                "You are not allowed to assign task to antoher user"
            )

        if user not in project_users:
            raise serializers.ValidationError(
                {"user_id": "User is not part of the project"}
            )

        task = Task.objects.filter(id=task_id).first()

        if not task or task not in project.tasks.all():
            raise serializers.ValidationError({"task_id": "Invalid Task"})

        return attrs


class ChangeTaskTaskListSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
    tasklist_id = serializers.IntegerField()

    class Meta:
        fields = (
            "project_id",
            "tasklist_id",
        )

    def validate_tasklist_id(self, tasklist_id):
        obj = TaskList.objects.filter(id=tasklist_id).first()

        if not obj:
            raise serializers.ValidationError(
                {"tasklist_id": "TaskList does not exist"}
            )

        return tasklist_id
