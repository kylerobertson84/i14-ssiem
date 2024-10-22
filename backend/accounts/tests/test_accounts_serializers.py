
from django.test import TestCase
from accounts.serializers import UserSerializer, RoleSerializer, EmployeeSerializer, PermissionSerializer
from accounts.models import User, Role, Employee, Permission

class UserSerializerTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='Admin')
        self.user_data = {
            'email': 'test@example.com',
            'password': 'password123',
            'role_id': self.role.role_id
        }
        self.serializer = UserSerializer(data=self.user_data)

    def test_user_serializer_valid(self):
        self.assertTrue(self.serializer.is_valid())

    def test_user_serializer_create(self):
        self.serializer.is_valid()
        user = self.serializer.save()
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('password123'))

class RoleSerializerTests(TestCase):
    def setUp(self):
        self.role_data = {'name': 'Admin'}
        self.serializer = RoleSerializer(data=self.role_data)

    def test_role_serializer_valid(self):
        self.assertTrue(self.serializer.is_valid())

class EmployeeSerializerTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='Admin')
        self.user = User.objects.create_user(email='test@example.com', password='password123', role=self.role)
        self.employee_data = {
            'user_id': self.user.user_id,
            'first_name': 'John',
            'last_name': 'Doe'
        }
        self.serializer = EmployeeSerializer(data=self.employee_data)

    def test_employee_serializer_valid(self):
        self.assertTrue(self.serializer.is_valid())

class PermissionSerializerTests(TestCase):
    def setUp(self):
        self.permission_data = {'permission_name': 'Can view'}
        self.serializer = PermissionSerializer(data=self.permission_data)

    def test_permission_serializer_valid(self):
        self.assertTrue(self.serializer.is_valid())
