
# accounts/serializers.py

from rest_framework import serializers
from .models import User, Role, Employee, Permission, RolePermission

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'role', 'password', 'is_active', 'is_staff']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_id', 'name']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'first_name', 'last_name', 'email']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['permission_id', 'name']

class RolePermissionSerializer(serializers.ModelSerializer):
    permission = PermissionSerializer()
    role = RoleSerializer()
    class Meta:
        model = RolePermission
        fields = ['role_permission_id', 'permission', 'role']