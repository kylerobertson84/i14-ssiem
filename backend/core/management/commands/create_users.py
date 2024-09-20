
# core/management/commands/create_users.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role

class Command(BaseCommand):
    help = 'Create users to use in SIEM'

    def handle(self, *args, **kwargs):
        User = get_user_model()  # Fetch the User model
        
        user_1_email = 'user1@siem.com'
        user_2_email = 'user2@siem.com'
        password = 'abc123'

        # Fetch the analyst role or create it if it doesn't exist
        analyst_role, created = Role.objects.get_or_create(name=Role.ANALYST)

        # Create user1
        if not User.objects.filter(email=user_1_email).exists():
            user_1 = User.objects.create(
                email=user_1_email,
                is_staff=True,
                is_superuser=False
            )
            user_1.set_password(password)  # Properly hash the password
            user_1.role = analyst_role  # Assign the analyst role
            user_1.save()
            self.stdout.write(self.style.SUCCESS(f'Analyst {user_1_email} created with password {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'Analyst {user_1_email} already exists.'))

        # Create user2 (repeat the same logic for the second user)
        if not User.objects.filter(email=user_2_email).exists():
            user_2 = User.objects.create(
                email=user_2_email,
                is_staff=True,
                is_superuser=False
            )
            user_2.set_password(password)  # Properly hash the password
            user_2.role = analyst_role  # Assign the analyst role
            user_2.save()
            self.stdout.write(self.style.SUCCESS(f'Analyst {user_2_email} created with password {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'Analyst {user_2_email} already exists.'))
