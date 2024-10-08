


from rest_framework.test import APITestCase
from accounts.models import User, Role
from accounts.serializers import UserSerializer

class UserSerializerTests(APITestCase):
    def setUp(self):
        # Create a role instance for the test
        self.role = Role.objects.create(name='Admin')

    def test_valid_user_creation(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123',
            'role': str(self.role.role_id)
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, data['username'])
        self.assertEqual(user.email, data['email'])
        self.assertTrue(user.check_password(data['password']))
        self.assertEqual(user.role, self.role)
    
    def test_password_write_only_field(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        serializer = UserSerializer(data=data)
        serializer.is_valid()
        self.assertNotIn('password', serializer.data)
    
    def test_user_creation_without_role(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
            # No role provided
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsNone(user.role)






    