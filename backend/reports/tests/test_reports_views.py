
from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import Rule
from reports.models import IncidentReport
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class IncidentReportViewSetTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='password')
        self.client.force_authenticate(user=self.user)
        self.rule = Rule.objects.create(name="Test Rule", description="Test description", severity="low")
        self.report = IncidentReport.objects.create(
            title="Test Report",
            type=IncidentReport.ReportType.SECURITY_INCIDENT,
            status=IncidentReport.ReportStatus.OPEN,
            user=self.user,
            description="Test Description"
        )
        self.report.rules.add(self.rule)

    def test_get_reports(self):
        url = reverse('incidentreport-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_report(self):
        url = reverse('incidentreport-list')
        data = {
            'title': 'New Incident',
            'type': 'network_traffic',
            'status': 'open',
            'description': 'New incident description',
            'rule_ids': [self.rule.id]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(IncidentReport.objects.count(), 2)

    def test_generate_pdf(self):
        url = reverse('incidentreport-generate-pdf', kwargs={'pk': self.report.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
