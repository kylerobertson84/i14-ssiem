
from rest_framework.test import APITestCase
from accounts.models import Role, Permission, RolePermission
from accounts.serializers import RolePermissionSerializer

class RolePermissionSerializerTests(APITestCase):

    def setUp(self):
        self.role = Role.objects.create(name='Admin')
        self.permission = Permission.objects.create(name='Can_Edit')

    def test_valid_role_permission_creation(self):
        data = {
            'role': str(self.role.role_id),
            'permission': str(self.permission.permission_id)
        }
        serializer = RolePermissionSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        role_permission = serializer.save()
        self.assertEqual(role_permission.role, self.role)
        self.assertEqual(role_permission.permission, self.permission)
    
    def test_invalid_role_permission_creation(self):
        data = {
            'role': str(self.role.role_id)
            # Missing permission
        }
        serializer = RolePermissionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('permission', serializer.errors)

        