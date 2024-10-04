
from django.test import TestCase
from accounts.models import User, Role, Permission, Employee, RolePermission
from django.core.exceptions import ValidationError

class UserModelTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='Admin')
        self.user = User.objects.create_user(email='test@example.com', password='password123', role=self.role)

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('password123'))
    
    def test_user_str(self):
        self.assertEqual(str(self.user), f"User ID: {self.user.user_id}. Email: {self.user.email}. Role: {self.role}. Created on {self.user.created_at} - Last updated on {self.user.updated_at}")

class RoleModelTests(TestCase):
    def setUp(self):
        self.admin_role = Role.objects.create(name='Admin')
        self.analyst_role = Role.objects.create(name='Analyst')

    def test_admin_role_creation(self):
        self.assertEqual(self.admin_role.name, 'Admin')
    
    def test_admin_role_has_permission(self):
        permission = Permission.objects.create(permission_name='Can create users')
        self.admin_role.permissions.add(permission)
        self.assertTrue(self.admin_role.has_permission('Can create users'))

    def test_analyst_role_creation(self):
        self.assertEqual(self.analyst_role.name, 'Analyst')
    
    def test_analyst_role_has_permission(self):
        permission = Permission.objects.create(permission_name='Can view')
        self.analyst_role.permissions.add(permission)
        self.assertTrue(self.analyst_role.has_permission('Can view'))


class EmployeeModelTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='Admin')
        self.user = User.objects.create_user(email='test@example.com', password='password123', role=self.role)
        self.employee = Employee.objects.create(user=self.user, first_name='John', last_name='Doe')

    def test_employee_creation(self):
        self.assertEqual(self.employee.first_name, 'John')
        self.assertEqual(self.employee.last_name, 'Doe')
    
    def test_employee_id_generation(self):
        self.assertEqual(len(self.employee.employee_id), 6)

class PermissionModelTests(TestCase):
    def setUp(self):
        self.permission = Permission.objects.create(permission_name='Can view')

    def test_permission_creation(self):
        self.assertEqual(self.permission.permission_name, 'Can view')

class RolePermissionModelTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='Admin')
        self.permission = Permission.objects.create(permission_name='Can view')
        self.role_permission = RolePermission.objects.create(role=self.role, permission=self.permission)

    def test_role_permission_creation(self):
        self.assertEqual(self.role_permission.role, self.role)
        self.assertEqual(self.role_permission.permission, self.permission)
