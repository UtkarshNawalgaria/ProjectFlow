from django.contrib.auth import get_user_model

from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated

from libs.response import TextJSONResponse

from .models import Project, Task, TaskList
from .permissions import (
    CanRetreiveUpdateDeleteTask,
    UserProjectPermission,
    IsProjectOwner,
)
from .serializers import (
    AddUserToProjectSerializer,
    ChangeTaskTaskListSerializer,
    ProjectDetailSerializer,
    ProjectListCreateSerializer,
    TasklistListCreateSerailzer,
    TasksWriteUpdateSerializer,
    AssignUserToTaskSerializer,
    TasksReadSerializer,
)

User = get_user_model()


class ProjectsViewSet(viewsets.ModelViewSet):
    model = Project
    permission_classes = (
        IsAuthenticated,
        UserProjectPermission,
    )

    @action(detail=True, methods=["post"], permission_classes=[IsProjectOwner])
    def add_user(self, request, pk=None):
        """
        Add user to project. Only project owner can add new
        users to the project.
        """

        project = Project.objects.filter(id=pk).first()

        if not project:
            raise ValidationError({"message": "No such project exists"})

        if not project.owner == request.user:
            raise PermissionDenied()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(project_id=pk)

        return TextJSONResponse(f"{user.email} has been added to the project")

    def get_serializer_context(self):
        context = {"request": self.request, "user": self.request.user}
        return context

    def get_serializer_class(self):
        if self.action in ["list", "create"]:
            return ProjectListCreateSerializer

        if self.action == "add_user":
            return AddUserToProjectSerializer

        return ProjectDetailSerializer

    def get_queryset(self):
        """
        Return all projects that the user is a part of.
        """

        organization_id = self.request.query_params.get("organization_id")
        queryset = self.request.user.projects.all()

        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)

        return queryset


class TasksViewSet(viewsets.ModelViewSet):
    model = Task
    permission_classes = [CanRetreiveUpdateDeleteTask,]

    @action(detail=True, methods=["POST", "PATCH"])
    def assign_to_user(self, request, pk=None):
        """
        Assign a task to another user. User must have access to the project.
        """

        task = Task.objects.filter(id=pk).first()

        if not task:
            raise ValidationError({"message": "No such task"})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = request.data.get("user_id")
        task_id = request.data.get("task_id")
        project_id = request.data.get("project_id")

        Project.objects.filter(id=project_id).update(owner_id=user_id)
        Task.objects.filter(id=task_id).update(owner_id=user_id)

        return TextJSONResponse(f"Assigned task to user")

    @action(detail=True, methods=["PUT"])
    def update_task_list(self, request, pk=None):
        """
        Change the tasklist of a Task.
        """

        task = Task.objects.filter(id=pk).first()

        if not task:
            raise ValidationError({"message": "No such task"})

        serializer = ChangeTaskTaskListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

    def get_serializer_context(self):
        context = {"request": self.request, "user": self.request.user}
        return context

    def get_serializer_class(self):
        if self.action in ["list", "retreive"]:
            return TasksReadSerializer

        if self.action == "assign_to_user":
            return AssignUserToTaskSerializer

        return TasksWriteUpdateSerializer

    def get_queryset(self):
        """
        Return all tasks that are associated with projects the current user
        is a part of.

        If `project_id` is sent in the query parameter, then return all
        tasks that are part of that particular project.
        """

        project_id = self.request.query_params.get("project_id")
        queryset = self.request.user.projects.all()

        if project_id:
            queryset = queryset.filter(id=project_id)

        project_ids = queryset.values_list("id", flat=True)

        return Task.objects.filter(project_id__in=list(project_ids))


class TaskListViewSet(viewsets.ModelViewSet):
    model = TaskList
    serializer_class = TasklistListCreateSerailzer
    permission_classes = (IsAuthenticated,)

    def get_context_data(self, **kwargs):
        context = {}
        context["project_id"] = self.request.query_params.get("project_id")
        return context

    def get_queryset(self):
        user = self.request.user
        queryset = TaskList.objects.none()
        context = self.get_context_data()
        project_id = context.get("project_id")

        if not project_id:
            raise ValidationError("Project ID is required to get the task lists")

        try:
            project = Project.objects.get(id=project_id)

            if user not in project.users.all():
                raise ValidationError("User is not part of the project")

            queryset = project.tasklists.all()

        except Project.DoesNotExist:
            raise ValidationError("No project with ID exists")

        return queryset
