from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Alert, AssignedAlert
from logs.models import EventData, BronzeEventData
from core.models import Rule
from django.contrib.auth import get_user_model

User = get_user_model()

class AlertsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.force_authenticate(user=self.user)

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
        self.alert = Alert.objects.create(
            timestamp="2023-05-20T10:00:00Z",
            event=self.event,
            status="NEW",
            severity="MEDIUM",
            rule=self.rule
        )

    def test_list_alerts(self):
        url = reverse('alert-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_retrieve_alert(self):
        url = reverse('alert-detail', args=[self.alert.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'NEW')

    def test_assign_alert(self):
        url = reverse('alert-assign', args=[self.alert.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(AssignedAlert.objects.filter(alert=self.alert, user=self.user).exists())