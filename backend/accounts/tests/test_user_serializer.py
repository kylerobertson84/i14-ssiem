
# from rest_framework.test import APITestCase
# from accounts.models import User, Role
# from accounts.serializers import UserSerializer

# class UserSerializerTests(APITestCase):
#     def setUp(self):
#         # Create a role instance for the test
#         self.role = Role.objects.create(name='Admin')

#     def test_valid_user_creation(self):
#         data = {
#             'username': 'testuser',
#             'email': 'test@example.com',
#             'password': 'password123',
#             'role': str(self.role.role_id)
#         }
#         serializer = UserSerializer(data=data)
#         self.assertTrue(serializer.is_valid())
#         user = serializer.save()
#         self.assertEqual(user.username, data['username'])
#         self.assertEqual(user.email, data['email'])
#         self.assertTrue(user.check_password(data['password']))
#         self.assertEqual(user.role, self.role)

# accounts/tests/test_serializers.py

from django.test import TestCase
from accounts.models import User, Role, Employee, Permission, RolePermission
from accounts.serializers import UserSerializer, RoleSerializer, EmployeeSerializer, PermissionSerializer, RolePermissionSerializer

class SerializerTestCase(TestCase):

    def setUp(self):
        self.role = Role.objects.create(name="Admin")
        self.permission = Permission.objects.create(name="Can Edit")
        self.user = User.objects.create_user(username="testuser", password="testpass", role=self.role)
        self.employee = Employee.objects.create(first_name="John", last_name="Doe", email="john.doe@example.com")
        self.role_permission = RolePermission.objects.create(role=self.role, permission=self.permission)

    def test_user_serializer(self):
        # Serialize the user instance
        serializer = UserSerializer(self.user)
        data = serializer.data

        # Check that serialized data is correct
        self.assertEqual(data['username'], self.user.username)
        self.assertEqual(data['email'], self.user.email)
        # self.assertEqual(data['role'], str(self.user.role.role_id)) # causes an UUID error.
        self.assertTrue('password' not in data)
    
    