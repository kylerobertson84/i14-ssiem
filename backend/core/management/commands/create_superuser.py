from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role

class Command(BaseCommand):
    help = 'Create a superuser if none exists'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = 'super@siem.com'
        password = 'admin'
        
        admin_role, created = Role.objects.get_or_create(name=Role.ADMIN)
        
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_superuser(
                email=email,
                password=password,
                is_staff=True,
                is_superuser=True
            )
            user.role = admin_role
            user.save()
            self.stdout.write(self.style.SUCCESS('Superuser created successfully.'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists.'))