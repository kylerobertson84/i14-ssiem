
# tests/test_views.py

from django.test import TestCase
from rest_framework.test import APIClient
from logs.models import BronzeEventData, RouterData
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import User, Role

User = get_user_model()

from rest_framework_simplejwt.tokens import RefreshToken

class BronzeEventDataViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('bronzeeventdata-list')
        admin_role, created = Role.objects.get_or_create(name=Role.ADMIN)
        self.admin_user = User.objects.create_user(email='admin@test.com', password='password', role=admin_role)
        self.client.force_authenticate(user=self.admin_user)  
        BronzeEventData.objects.create(
            hostname="test-host",
            EventType="EventType1",
            iso_timestamp="2023-09-01T12:00:00Z"
        )

    def test_list_bronze_event_data(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_count_action(self):
        response = self.client.get(reverse('bronzeeventdata-count'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)


class RouterDataViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        admin_role, created = Role.objects.get_or_create(name=Role.ADMIN)
        self.admin_user = User.objects.create_user(email='admin2@test.com', password='password', role=admin_role)
        self.client.force_authenticate(user=self.admin_user)  
        
        self.url = reverse('routerdata-list')
        RouterData.objects.create(
            hostname="router-host",
            process="router-process",
            date_time="2023-09-01 12:00:00"
        )

    def test_list_router_data(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_router_log_count_action(self):
        response = self.client.get(reverse('routerdata-router-log-count'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['router_log_count'], 1)
