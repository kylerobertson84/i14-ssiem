
from typing import Any
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role

class Command(BaseCommand):
    help = 'Create users to use in SIEM'

    def handle(self, *args, **kwargs):
        pass