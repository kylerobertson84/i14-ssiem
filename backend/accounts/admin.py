# accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Role, Employee, Permission, RolePermission

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'get_role', 'is_active', 'is_staff', 'is_superuser')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'role')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'role')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)

    def get_role(self, obj):
        return obj.role.name if obj.role else '-'
    get_role.short_description = _('Role')

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'first_name', 'last_name', 'department', 'job_title')
    search_fields = ('employee_id', 'first_name', 'last_name', 'user__email')
    list_filter = ('department',)
    raw_id_fields = ('user',)

class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 1

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_permissions')
    search_fields = ('name',)
    inlines = [RolePermissionInline]

    def get_permissions(self, obj):
        return ", ".join([p.permission_name for p in obj.permissions.all()])
    get_permissions.short_description = _('Permissions')

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('permission_name',)
    search_fields = ('permission_name',)

@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission')
    list_filter = ('role', 'permission')
    search_fields = ('role__name', 'permission__permission_name')