# logs/test_api.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import BronzeEventData, EventData
from core.models import Rule

class LogsAPITestCase(APITestCase):
    def setUp(self):
        # Create test data
        self.bronze_event = BronzeEventData.objects.create(
            event_time="2023-05-20T10:00:00Z",
            hostname="test-host",
            event_type="test-type",
            severity="LOW",
            event_id=1
        )
        self.rule = Rule.objects.create(
            rule_name="Test Rule",
            description="Test Description",
            conditions="Test Conditions"
        )
        self.event = EventData.objects.create(
            timestamp="2023-05-20T10:00:00Z",
            source=self.bronze_event,
            rule=self.rule
        )

    def test_list_bronze_events(self):
        url = reverse('bronzeeventdata-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_retrieve_bronze_event(self):
        url = reverse('bronzeeventdata-detail', args=[self.bronze_event.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['hostname'], 'test-host')

    def test_list_events(self):
        url = reverse('eventdata-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_retrieve_event(self):
        url = reverse('eventdata-detail', args=[self.event.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['source']['hostname'], 'test-host')