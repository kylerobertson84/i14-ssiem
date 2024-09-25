
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from alerts.models import Alert, InvestigateAlert
from logs.models import BronzeEventData
from core.models import Rule
from accounts.models import User
from alerts.serializers import AlertSerializer, InvestigateAlertSerializer

class AlertViewSetTest(APITestCase):
    
    def setUp(self):
        # Create necessary objects for the tests
        self.user = User.objects.create_user(email='test@example.com', password='password')
        self.event_data = BronzeEventData.objects.create(EventID='1', UserID='user1', hostname='host1')
        self.rule = Rule.objects.create(name='Test Rule')
        self.alert = Alert.objects.create(event=self.event_data, rule=self.rule, severity='High', comments='Test comment')
        self.url = reverse('alert-list')  # Adjust to your URL pattern name

    def test_create_alert(self):
        data = {
            'event': {
                'EventID': '2',
                'UserID': 'user2',
                'hostname': 'host2'
            },
            'rule': self.rule.id,
            'severity': 'Medium',
            'comments': 'New test comment'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Alert.objects.count(), 2)  # 1 existing + 1 new

    def test_assign_alert(self):
        assign_url = reverse('alert-assign', kwargs={'pk': self.alert.id})  # Adjust to your URL pattern name
        response = self.client.post(assign_url, {'assigned_to': self.user.user_id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        investigate_alert = InvestigateAlert.objects.first()
        self.assertIsNotNone(investigate_alert)
        self.assertEqual(investigate_alert.assigned_to, self.user)

    def test_assign_alert_no_user(self):
        assign_url = reverse('alert-assign', kwargs={'pk': self.alert.id})
        response = self.client.post(assign_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'No analyst ID provided')

    def test_latest_alerts(self):
        latest_url = reverse('alert-latest-alerts')  # Adjust to your URL pattern name
        response = self.client.get(latest_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

class InvestigateAlertViewSetTest(APITestCase):
    
    def setUp(self):
        # Create necessary objects for the tests
        self.user = User.objects.create_user(email='test@example.com', password='password')
        self.event_data = BronzeEventData.objects.create(EventID='1', UserID='user1', hostname='host1')
        self.rule = Rule.objects.create(name='Test Rule')
        self.alert = Alert.objects.create(event=self.event_data, rule=self.rule, severity='High', comments='Test comment')
        self.investigate_alert = InvestigateAlert.objects.create(alert=self.alert, assigned_to=self.user, status='Investigating', notes='Notes here')
        self.url = reverse('investigatealert-list')  # Adjust to your URL pattern name

    def test_investigation_status_count(self):
        status_url = reverse('investigatealert-investigation-status-count')  # Adjust to your URL pattern name
        response = self.client.get(status_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('closed_count', response.data)
        self.assertIn('open_count', response.data)
        self.assertIn('in_progress_count', response.data)

