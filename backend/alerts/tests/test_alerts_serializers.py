
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.test import TestCase
from alerts.models import Alert, InvestigateAlert
from logs.models import BronzeEventData
from core.models import Rule
from django.contrib.auth import get_user_model
from alerts.serializers import AlertSerializer, InvestigateAlertSerializer

User = get_user_model()

class AlertSerializerTest(TestCase):
    
    def setUp(self):
        # Create necessary objects for the tests
        self.user = User.objects.create_user(email='test@example.com', password='password')
        self.event_data = BronzeEventData.objects.create(EventID='1', UserID='user1', hostname='host1')
        self.rule = Rule.objects.create(name='Test Rule')
        self.alert = Alert.objects.create(event=self.event_data, rule=self.rule, severity='High', comments='Test comment')

    def test_alert_serializer(self):
        serializer = AlertSerializer(instance=self.alert)
        data = serializer.data
        
        self.assertEqual(data['id'], self.alert.id)
        self.assertEqual(data['event']['EventID'], self.event_data.EventID)
        self.assertEqual(data['rule'], self.rule.name)
        self.assertEqual(data['severity'], self.alert.severity)
        self.assertEqual(data['comments'], self.alert.comments)

    def test_alert_serializer_to_representation(self):
        serializer = AlertSerializer(instance=self.alert)
        representation = serializer.to_representation(self.alert)

        self.assertEqual(representation['event']['EventID'], self.event_data.EventID)
        self.assertEqual(representation['event']['UserID'], self.event_data.UserID)
        self.assertEqual(representation['event']['hostname'], self.event_data.hostname)
        self.assertEqual(representation['rule'], self.rule.name)

class InvestigateAlertSerializerTest(TestCase):
    
    def setUp(self):
        # Create necessary objects for the tests
        self.user = User.objects.create_user(email='test@example.com', password='password')
        self.event_data = BronzeEventData.objects.create(EventID='1', UserID='user1', hostname='host1')
        self.rule = Rule.objects.create(name='Test Rule')
        self.alert = Alert.objects.create(event=self.event_data, rule=self.rule, severity='High', comments='Test comment')
        self.investigate_alert = InvestigateAlert.objects.create(alert=self.alert, assigned_to=self.user, status='Investigating', notes='Notes here')

    def test_investigate_alert_serializer(self):
        serializer = InvestigateAlertSerializer(instance=self.investigate_alert)
        data = serializer.data
        
        self.assertEqual(data['id'], self.investigate_alert.id)
        self.assertEqual(data['alert']['id'], self.alert.id)
        self.assertEqual(data['assigned_to']['email'], self.user.email)
        self.assertEqual(data['status'], self.investigate_alert.status)
        self.assertEqual(data['notes'], self.investigate_alert.notes)

