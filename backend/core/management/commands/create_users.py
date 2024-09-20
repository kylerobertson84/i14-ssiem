
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
        admin_1_email = 'admin1@siem.com'
        admin_2_email = 'admin2@siem.com'

        password = 'abc123'
        
        # Fetch the analyst role or create it if it doesn't exist
        
        analyst_role, created = Role.objects.get_or_create(name=Role.ANALYST)
        admin_role, created = Role.objects.get_or_create(name=Role.ADMIN)

        # Create Analyst users
        if not User.objects.filter(email=user_1_email).exists():
            user_1 = User.objects.create(
                email=user_1_email,
                is_staff=True,
                is_superuser=False
            )
            user_1.set_password(password)  
            user_1.role = analyst_role  
            user_1.save()
            self.stdout.write(self.style.SUCCESS(f'Analyst {user_1_email} created with password {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'Analyst {user_1_email} already exists.'))

        if not User.objects.filter(email=user_2_email).exists():
            user_2 = User.objects.create(
                email=user_2_email,
                is_staff=True,
                is_superuser=False
            )
            user_2.set_password(password) 
            user_2.role = analyst_role  
            user_2.save()
            self.stdout.write(self.style.SUCCESS(f'Analyst {user_2_email} created with password {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'Analyst {user_2_email} already exists.'))
        
        # Create Admin users
        if not User.objects.filter(email=admin_1_email).exists():
            admin_1 = User.objects.create(
                email=admin_1_email,
                is_staff=True,
                is_superuser=False
            )
            admin_1.set_password(password)  
            admin_1.role = admin_role 
            admin_1.save()
            self.stdout.write(self.style.SUCCESS(f'Analyst {admin_1_email} created with password {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'Analyst {admin_1_email} already exists.'))
        
        if not User.objects.filter(email=admin_2_email).exists():
            admin_2 = User.objects.create(
                email=admin_2_email,
                is_staff=True,
                is_superuser=False
            )
            admin_2.set_password(password)  
            admin_2.role = admin_role 
            admin_2.save()
            self.stdout.write(self.style.SUCCESS(f'Analyst {admin_2_email} created with password {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'Analyst {admin_2_email} already exists.'))
