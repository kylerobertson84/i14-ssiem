
from django.test import TestCase
from django.contrib.auth import get_user_model
from core.models import Rule
from reports.models import IncidentReport

User = get_user_model()

class IncidentReportModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='password')
        self.rule = Rule.objects.create(name='Test Rule', description='Test rule description', severity='low')
        self.report = IncidentReport.objects.create(
            title="Test Report",
            type=IncidentReport.ReportType.SECURITY_INCIDENT,
            status=IncidentReport.ReportStatus.OPEN,
            user=self.user,
            description="Test Description"
        )
        self.report.rules.add(self.rule)

    def test_report_creation(self):
        self.assertEqual(self.report.title, "Test Report")
        self.assertEqual(self.report.type, 'security_incident')
        self.assertEqual(self.report.status, 'open')
        self.assertEqual(self.report.user, self.user)
        self.assertEqual(self.report.description, "Test Description")
        self.assertIn(self.rule, self.report.rules.all())
    
    def test_str_representation(self):
        self.assertEqual(str(self.report), f"Incident Report {self.report.id} - {self.report.type}")
