from rest_framework import serializers
from .models import User, Role, Employee, Permission, RolePermission
from typing import List, Optional
from django.db.models import Model
from rest_framework.request import Request
from drf_spectacular.utils import extend_schema_field

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['permission_id', 'permission_name',]

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Role
        fields = ['role_id', 'name', 'permissions']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = RoleSerializer(read_only=True)
    role_id = serializers.UUIDField(write_only=True, required=False)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['user_id', 'email', 'role', 'role_id', 'password', 'is_active', 'is_staff', 'permissions']

    @extend_schema_field(List[str])
    def get_permissions(self, obj: Model) -> List[str]:
        return [perm.permission_name for perm in obj.role.permissions.all()] if obj.role else []

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        role_id = validated_data.pop('role_id', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
        if role_id:
            user.role_id = role_id
        user.save()
        return user

    def get_username(self):
        return self.email.split('@')[0]

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Employee
        fields = ['user', 'user_id', 'employee_id', 'first_name', 'last_name', 'department', 'job_title']

class RolePermissionSerializer(serializers.ModelSerializer):
    permission = PermissionSerializer()
    role = RoleSerializer()

    class Meta:
        model = RolePermission
        fields = ['role', 'permission']