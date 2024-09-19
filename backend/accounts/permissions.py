
# accounts/permissions.py

from rest_framework import permissions

class RoleBasedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow all authenticated users to perform read operations
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        # Check if user has the required role for other operations
        required_roles = getattr(view, 'required_roles', [])
        return request.user.is_authenticated and (request.user.role.name in required_roles if request.user.role else False)