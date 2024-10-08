
from rest_framework.test import APITestCase
from accounts.models import Permission
from accounts.serializers import PermissionSerializer

class PermissionSerializerTests(APITestCase):

    def test_valid_permission_creation(self):
        data = {'name': 'Can_View'}
        serializer = PermissionSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        permission = serializer.save()
        self.assertEqual(permission.name, data['name'])

    def test_invalid_permission_creation(self):
        data = {}
        serializer = PermissionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
