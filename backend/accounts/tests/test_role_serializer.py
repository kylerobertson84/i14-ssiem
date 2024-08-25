
from rest_framework.test import APITestCase
from accounts.models import Role
from accounts.serializers import RoleSerializer

class RoleSerializerTests(APITestCase):

    def test_valid_role_creation(self):
        data = {'name': 'Admin'}
        serializer = RoleSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        role = serializer.save()
        self.assertEqual(role.name, data['name'])

    def test_invalid_role_creation(self):
        data = {}
        serializer = RoleSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
    
    
