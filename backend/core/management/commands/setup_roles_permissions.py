from django.core.management.base import BaseCommand
from accounts.models import Role, Permission

class Command(BaseCommand):
    help = 'Set up initial roles and permissions'

    def handle(self, *args, **options):
        # Create roles
        admin_role, _ = Role.objects.get_or_create(name=Role.ADMIN)
        analyst_role, _ = Role.objects.get_or_create(name=Role.ANALYST)

        # Create permissions
        permissions = [
            ('view_dashboard', 'Can View Dashboard'),
            ('edit_profile', 'Can EditOwn Profile'),
            ('view_reports', 'Can View Reports'),
            ('create_reports', 'Can Create Reports'),
            ('edit_reports', 'Can Edit Reports'),
            ('delete_reports', 'Can Delete Reports'),
            ('manage_users', 'Can Manage Users'),
            ('manage_roles', 'Can Manage Roles and Permissions'),
        ]

        for perm_name, perm_name in permissions:
            permission, _ = Permission.objects.get_or_create(
                permission_name=perm_name,
                defaults={'permission_name': perm_name}
            )

            # Assign permissions to roles
            if perm_name in ['view_dashboard', 'edit_profile', 'view_reports', 'create_reports']:
                analyst_role.permissions.add(permission)

            # Admin gets all permissions
            admin_role.permissions.add(permission)

        self.stdout.write(self.style.SUCCESS('Successfully set up roles and permissions'))