from django.contrib import admin

from .models import Project, Task, TaskList, ProjectUsers


class ProjectUsersInline(admin.TabularInline):
    model = ProjectUsers
    readonly_fields = ["user"]
    fields = ["user", "role",]


class ProjectAdmin(admin.ModelAdmin):
    model = Project
    list_display = ("id", "title", "organization", "owner", "task_count")
    inlines = [ProjectUsersInline]


class TaskAdmin(admin.ModelAdmin):
    model = Task
    list_display = ("id", "title", "priority", "project", "tasklist")
    list_filter = ["project", "priority", "end_date"]


class TaskListAdmin(admin.ModelAdmin):
    model = TaskList
    list_display = ("id", "title", "project")
    list_filter = ["project"]


class ProjectUsersAdmin(admin.ModelAdmin):
    model = ProjectUsers
    list_display = ("id", "project", "user", "role")
    list_filter = ["project"]



admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(TaskList, TaskListAdmin)
admin.site.register(ProjectUsers, ProjectUsersAdmin)
