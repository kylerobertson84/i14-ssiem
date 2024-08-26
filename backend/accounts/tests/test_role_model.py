
# accounts/tests/test_role_model.py

from django.test import TestCase
from accounts.models import Role

class RoleModelTest(TestCase):
    def test_create_role(self):
        role = Role.objects.create(name="Manager")
        self.assertEqual(role.name, "Manager")