from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import IncidentReport
from logs.models import BronzeEventData
from django.contrib.auth import get_user_model

User = get_user_model()

class ReportsAPITestCase(TestCase):
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
        self.report = IncidentReport.objects.create(
            type="Security Incident",
            status="ongoing",
            source=self.bronze_event,
            user=self.user,
            description="Test incident report"
        )

    def test_list_reports(self):
        url = reverse('incidentreport-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_retrieve_report(self):
        url = reverse('incidentreport-detail', args=[self.report.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'Security Incident')

    def test_create_report(self):
        url = reverse('incidentreport-list')
        data = {
            'type': 'New Incident',
            'status': 'ongoing',
            'source': self.bronze_event.id,
            'description': 'New test incident'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(IncidentReport.objects.count(), 2)