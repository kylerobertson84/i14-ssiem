
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, Role
from django.urls import reverse

class UserViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role = Role.objects.create(name='Admin')
        self.user_data = {
            'email': 'test@example.com',
            'password': 'password123',
            'role_id': self.role.role_id
        }
        # Create a superuser for authentication
        self.superuser = User.objects.create_superuser(email='admin@example.com', password='adminpassword')

        # Authenticate the client
        self.client.force_authenticate(user=self.superuser)

    def test_create_user(self):
        response = self.client.post(reverse('user-list'), self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_get_user(self):
        user = User.objects.create_user(**self.user_data)
        response = self.client.get(reverse('user-detail', args=[user.user_id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], user.email)