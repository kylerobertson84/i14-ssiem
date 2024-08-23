
# accounts/tests.py

from django.test import TestCase
from accounts.models import User, Role

class UserModelTest(TestCase):
    
    def setUp(self):
        self.role = Role.objects.create(name="Admin")

    

