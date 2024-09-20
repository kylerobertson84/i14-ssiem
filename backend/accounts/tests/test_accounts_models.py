
# accounts/tests.py

from django.test import TestCase
from accounts.models import User, Role, Employee, Permission, CustomUserManager

class UserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('testpassword'))

    def test_user_creation_without_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password='testpassword')

    def test_superuser_creation(self):
        superuser = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword'
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

class RoleModelTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name=Role.ADMIN)

    def test_role_creation(self):
        self.assertEqual(self.role.name, Role.ADMIN)

    def test_has_permission(self):
        permission = Permission.objects.create(permission_name='can_view')
        self.role.permissions.add(permission)

        self.assertTrue(self.role.has_permission('can_view'))
        self.assertFalse(self.role.has_permission('cannot_view'))

class EmployeeModelTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name=Role.ADMIN)
        self.user = User.objects.create_user(email='employee@example.com', password='testpassword')
        self.employee = Employee.objects.create(user=self.user, first_name='John', last_name='Doe')

    def test_employee_creation(self):
        self.assertEqual(self.employee.first_name, 'John')
        self.assertEqual(self.employee.last_name, 'Doe')

    def test_employee_id_generation(self):
        employee_2 = Employee.objects.create(user=self.user, first_name='Jane', last_name='Smith')
        self.assertNotEqual(self.employee.employee_id, employee_2.employee_id)

class PermissionModelTests(TestCase):
    def setUp(self):
        self.permission = Permission.objects.create(permission_name='can_edit')

    def test_permission_creation(self):
        self.assertEqual(self.permission.permission_name, 'can_edit')

class CustomUserManagerTests(TestCase):
    def test_create_user(self):
        manager = CustomUserManager()
        user = manager.create_user('test@example.com', 'testpassword')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpassword'))

    def test_create_superuser(self):
        manager = CustomUserManager()
        superuser = manager.create_superuser('admin@example.com', 'adminpassword')
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
