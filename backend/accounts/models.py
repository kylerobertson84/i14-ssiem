from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from utils.models import BaseModel

class CustomUserManager(BaseUserManager):
    def create_user(self, user_id, username, password=None, **extra_fields):
        if not user_id:
            raise ValueError('The User ID must be set')
        user = self.model(user_id=user_id, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(user_id, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    user_id = models.CharField(max_length=15, primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['user_id']

    def __str__(self):
        return self.username

class Role(BaseModel):
    role_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Employee(BaseModel):
    employee_id = models.CharField(max_length=10, primary_key=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField(max_length=80)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Permission(BaseModel):
    permission_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class RolePermission(BaseModel):
    role_permission_id = models.CharField(max_length=10, primary_key=True)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.role.name} - {self.permission.name}"