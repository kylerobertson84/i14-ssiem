
# accounts/models.py

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.db.models import Max
from utils.models import BaseModel

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=80, unique=True)
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    ## is_staff is used to determine if the user is allowed to access the admin site
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"User ID: {self.user_id}. Email: {self.email}. Role: {self.role}. Created on {self.created_at} - Last updated on {self.updated_at}"
    
    def has_permission(self, permission_name):
        if self.role:
            return self.role.has_permission(permission_name)
        return False

class Role(BaseModel):
    # Hardcode roles here
    ADMIN = 'ADMIN'
    ANALYST = 'ANALYST'
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (ANALYST, 'Analyst'),
    ]
    
    role_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=20)
    permissions = models.ManyToManyField('Permission', through='RolePermission')

    def __str__(self):
        return f"Role ID: {self.role_id} - {self.name}. With permissions: {', '.join([p.permission_name for p in self.permissions.all()])}. Created on {self.created_at} - Last updated on {self.updated_at}"

    def has_permission(self, permission_name):
        return self.permissions.filter(permission_name=permission_name).exists()

class Employee(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, default=None)
    employee_id = models.CharField(max_length=6, unique=True, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    department = models.CharField(max_length=50, blank=True, null=True)
    job_title = models.CharField(max_length=50, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.employee_id:
            # Get the maximum employee_id
            max_id = Employee.objects.aggregate(Max('employee_id'))['employee_id__max']
            if max_id is None:
                next_id = 1
            else:
                # Basically, 6 digits for internal use like HR stuff increment by 1
                # Extract the numeric part and increment by 1
                next_id = int(max_id.replace(' ', '')) + 1
            # self.employee_id = f"{next_id:06d}"[:3] + ' ' + f"{next_id:06d}"[3:]
            self.employee_id = f"{next_id:06d}"[:3] + ' ' + f"{next_id:06d}"[3:]

        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Employee ID: {self.employee_id}. {self.first_name} {self.last_name} started on {self.created_at}. Last updated on {self.updated_at}"

class Permission(BaseModel):
    permission_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    permission_name = models.CharField(max_length=50, default=None, unique=True)

    def __str__(self):
        return f"{self.permission_name}. Created on {self.created_at} - Last updated on {self.updated_at}"

class RolePermission(BaseModel):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('role', 'permission')

    def __str__(self):
        return f"{self.role.name} - {self.permission.permission_name}. Created on {self.created_at} - Last updated on {self.updated_at}"