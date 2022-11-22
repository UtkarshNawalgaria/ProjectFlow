from rest_framework import permissions


class CanRetreiveUpdateDeleteTask(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.can_delete_or_update(request.user)


class IsProjectOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsTaskOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class UserProjectPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        SAFE_METHODS = ["HEAD", "OPTIONS"]

        if request.method in SAFE_METHODS:
            return True

        if request.method in ["PUT", "DELETE", "PATCH"]:
            return obj.has_permission(request.user, request.method)

        return True
