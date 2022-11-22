from rest_framework.routers import DefaultRouter

from .views import ProjectsViewSet, TasksViewSet, TaskListViewSet

router = DefaultRouter()

router.register("project", ProjectsViewSet, basename="project")
router.register("task", TasksViewSet, basename="task")
router.register("tasklist", TaskListViewSet, basename="tasklist")
