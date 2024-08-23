
# accounts/tests/test_permission_model.py

from django.test import TestCase
from accounts.models import Permission

class PermissionModelTest(TestCase):
    def test_create_permission(self):
        permission = Permission.objects.create(name="Edit User")
        self.assertEqual(permission.name, "Edit User")
        self.assertEqual(str(permission), "Edit User")