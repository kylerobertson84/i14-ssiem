from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User, Role
from logs.models import BronzeEventData, RouterData
from django.db import connection
from django.utils import timezone

class CustomQueryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role = Role.objects.create(name='Admin')
        self.user = User.objects.create_user(email='test@example.com', password='password123', role=self.role)
        self.client.force_authenticate(user=self.user)

        # Create test data
        self.bronze_event1 = BronzeEventData.objects.create(hostname='test1', EventType='Login', EventID='4624', AccountName='user1')
        self.bronze_event2 = BronzeEventData.objects.create(hostname='test2', EventType='Logout', EventID='4634', AccountName='user2')
        self.router_data1 = RouterData.objects.create(hostname='router1', process='OSPF', message='Link up')
        self.router_data2 = RouterData.objects.create(hostname='router2', process='BGP', message='Peer down')

    def test_bronze_event_list(self):
        url = reverse('bronzeeventdata-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_bronze_event_filter(self):
        url = reverse('bronzeeventdata-list')
        response = self.client.get(url, {'event_type': 'Login'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['EventType'], 'Login')

    def test_bronze_event_search(self):
        url = reverse('bronzeeventdata-list')
        response = self.client.get(url, {'search': 'user1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['AccountName'], 'user1')

    def test_router_data_list(self):
        url = reverse('routerdata-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_router_data_filter(self):
        url = reverse('routerdata-list')
        response = self.client.get(url, {'process': 'OSPF'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['process'], 'OSPF')

    def test_log_percentages(self):
        url = reverse('log-percentage-log-percentages')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('windows_os_percentage', response.data)
        self.assertIn('network_percentage', response.data)

    def test_logs_per_hour(self):
        url = reverse('logs-aggregation-logs-per-hour')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_events_today(self):
        url = reverse('events-today-events-today')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('events_today', response.data)

    def test_hostname_count(self):
        url = reverse('hostname-count-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_devices', response.data)

    def tearDown(self):
        User.objects.all().delete()
        Role.objects.all().delete()
        BronzeEventData.objects.all().delete()
        RouterData.objects.all().delete()