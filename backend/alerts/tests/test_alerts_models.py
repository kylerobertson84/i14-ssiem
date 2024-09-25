
from django.test import TestCase
from django.contrib.auth import get_user_model
from core.models import Rule
from logs.models import BronzeEventData
from alerts.models import Alert, InvestigateAlert, AlertSeverity, InvestigationStatus
from django.utils import timezone

User = get_user_model()

class AlertModelTest(TestCase):
    
    def setUp(self):
        self.rule = Rule.objects.create(name="Test Rule")
        self.event = BronzeEventData.objects.create(EventType="Test Event", message="a message")
        self.alert = Alert.objects.create(rule=self.rule, event=self.event, severity=AlertSeverity.HIGH)
        self.user = User.objects.create_user(email='testuser@test.com', password='testpass')
        self.investigation = InvestigateAlert.objects.create(alert=self.alert, assigned_to=self.user, status=InvestigationStatus.OPEN)

    def test_alert_creation(self):
        """Test that an Alert object is created successfully."""
        self.assertIsInstance(self.alert, Alert)
        self.assertEqual(self.alert.severity, AlertSeverity.HIGH)
        self.assertEqual(str(self.alert), f"Alert {self.alert.id} at {self.alert.created_at} with {self.alert.severity}. Triggered by {self.alert.event} with rule {self.alert.rule.name}. Created on {self.alert.created_at} - Last updated on {self.alert.updated_at}")

    def test_alert_defaults(self):
        """Test that the default values of the Alert model fields are correct."""
        alert = Alert.objects.create(rule=self.rule, event=self.event)
        self.assertEqual(alert.severity, AlertSeverity.INFO)
        self.assertEqual(alert.comments, None)

    def test_investigate_alert_creation(self):
        """Test that an InvestigateAlert object is created successfully."""
        self.assertIsInstance(self.investigation, InvestigateAlert)
        self.assertEqual(self.investigation.status, InvestigationStatus.OPEN)
        self.assertEqual(self.investigation.assigned_to.email, 'testuser@test.com')
        self.assertEqual(str(self.investigation), f"Alert {self.investigation.alert} assigned to {self.investigation.assigned_to} at {self.investigation.created_at} with status {self.investigation.status}. Investigation ID: {self.investigation.id}, created on {self.investigation.created_at} - Last updated on {self.investigation.updated_at}")
    
    def test_investigate_alert_status_update(self):
        """Test updating the status of an InvestigateAlert."""
        self.investigation.status = InvestigationStatus.CLOSED
        self.investigation.save()
        self.assertEqual(self.investigation.status, InvestigationStatus.CLOSED)
