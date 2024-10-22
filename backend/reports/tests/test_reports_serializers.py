
from rest_framework.test import APITestCase
from core.models import Rule
from reports.models import IncidentReport
from reports.serializers import IncidentReportSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class IncidentReportSerializerTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='password')
        self.rule = Rule.objects.create(name="Test Rule", description="Test description", severity="low")
        self.report = IncidentReport.objects.create(
            title="Test Report",
            type=IncidentReport.ReportType.SECURITY_INCIDENT,
            status=IncidentReport.ReportStatus.OPEN,
            user=self.user,
            description="Test Description"
        )
        self.report.rules.add(self.rule)
        self.client.force_authenticate(user=self.user)
        # print(self.user.user_id)

    def test_serializer_data(self):
        serializer = IncidentReportSerializer(self.report, context={'request': None})
        data = serializer.data
        self.assertEqual(data['title'], "Test Report")
        self.assertEqual(data['type'], 'security_incident')
        self.assertEqual(data['user']['email'], self.user.email)

    def test_serializer_create(self):
        data = {
            'title': 'New Incident',
            'type': 'network_traffic',
            'status': 'draft',
            'user': self.user.user_id,
            'description': 'New incident description',
            'rule_ids': [self.rule.id]
        }
        serializer = IncidentReportSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        report = serializer.save(user=self.user)
        self.assertEqual(report.title, 'New Incident')
        self.assertIn(self.rule, report.rules.all())

    def test_invalid_serializer(self):
        data = {
            'title': None,
            'type': 'invalid_type',
            
        }
        serializer = IncidentReportSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('type', serializer.errors)
        self.assertIn('title', serializer.errors)
