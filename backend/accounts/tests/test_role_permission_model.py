
# accounts/tests/test_role_permission_model.py

from django.test import TestCase
from accounts.models import Role, Permission, RolePermission

class RolePermissionModelTest(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name="Admin")
        self.permission = Permission.objects.create(name="Add User")

    def test_create_role_permission(self):
        role_permission = RolePermission.objects.create(role=self.role, permission=self.permission)
        self.assertEqual(str(role_permission), "Admin - Add User")
