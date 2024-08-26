
# accounts/tests/test_user_model.py

from django.test import TestCase
from accounts.models import User, Role

class UserModelTest(TestCase):
    
    def setUp(self):
        self.role = Role.objects.create(name="Admin")

    def test_create_user(self):
        user = User.objects.create_user(username="testuser", password="password123", role=self.role)
        self.assertEqual(user.username, "testuser")
        self.assertTrue(user.check_password("password123"))
        self.assertEqual(user.role.name, "Admin")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(username="adminuser", password="password123")
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    
