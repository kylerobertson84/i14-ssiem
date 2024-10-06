from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model, user_logged_in
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import User, Role
import logging

User = get_user_model()

class AccountsLoggingTestCase(TestCase):
    def setUp(self):
        self.logger = logging.getLogger('accounts')
        self.factory = RequestFactory()
        self.client = APIClient()
        self.role = Role.objects.create(name='Admin')
        self.user = User.objects.create_user(email='testuser@example.com', password='testpass123', role=self.role)

    def test_user_creation_logging(self):
        with self.assertLogs('accounts', level='DEBUG') as log:
            new_user = User.objects.create_user(email='newuser@example.com', password='newpass123', role=self.role)
        self.assertTrue(any('New user created: newuser@example.com' in msg for msg in log.output))
        
        # Test creation through API
        self.client.force_authenticate(user=self.user)
        with self.assertLogs('accounts', level='DEBUG') as log:
            response = self.client.post(reverse('user-list'), {'email': 'apiuser@example.com', 'password': 'apipass123', 'role_id': self.role.role_id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(any('New user created: apiuser@example.com' in msg for msg in log.output))

    def test_user_update_logging(self):
        # Test update through model save
        with self.assertLogs('accounts', level='DEBUG') as log:
            self.user.email = 'updated@example.com'
            self.user.save()
        self.assertTrue(any('User updated: updated@example.com' in msg for msg in log.output))
        
        # Test update through API
        self.client.force_authenticate(user=self.user)
        with self.assertLogs('accounts', level='DEBUG') as log:
            response = self.client.patch(reverse('user-detail', args=[self.user.user_id]), {'email': 'apitupdated@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('User updated: apitupdated@example.com' in msg for msg in log.output))

    def test_user_login_logging(self):
        with self.assertLogs('accounts', level='DEBUG') as log:
            login_successful = self.client.login(email='testuser@example.com', password='testpass123')
            self.assertTrue(login_successful)
            # Manually send the user_logged_in signal
            user_logged_in.send(sender=self.user.__class__, request=None, user=self.user)
        self.assertTrue(any('User testuser@example.com logged in' in msg for msg in log.output))

    def test_user_logout_logging(self):
        self.client.login(email='testuser@example.com', password='testpass123')
        with self.assertLogs('accounts', level='DEBUG') as log:
            self.client.logout()
        self.assertTrue(any('User testuser@example.com logged out' in msg for msg in log.output))

    def test_failed_login_logging(self):
        with self.assertLogs('accounts', level='DEBUG') as log:
            self.client.login(email='testuser@example.com', password='wrongpassword')
        self.assertTrue(any('Login failed for: testuser@example.com' in msg for msg in log.output))

    def test_viewset_action_logging(self):
        self.client.force_authenticate(user=self.user)
        with self.assertLogs('accounts', level='DEBUG') as log:
            response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('List action performed on UserViewSet' in msg for msg in log.output))

    def test_user_me_action_logging(self):
        self.client.force_authenticate(user=self.user)
        with self.assertLogs('accounts', level='DEBUG') as log:
            response = self.client.get(reverse('user-me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('User retrieved their own info: testuser@example.com' in msg for msg in log.output))

    def tearDown(self):
        User.objects.all().delete()
        Role.objects.all().delete()