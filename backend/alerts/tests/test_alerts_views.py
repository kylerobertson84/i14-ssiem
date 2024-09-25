
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from alerts.models import Alert, InvestigateAlert, BronzeEventData, Rule
from accounts.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class AlertViewSetTests(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpass')

        # Create a test rule
        self.rule = Rule.objects.create(name='Test Rule', description='Test Description')

        # Create a test event
        self.event = BronzeEventData.objects.create(EventID='E123', UserID='U123', hostname='localhost')

        # Create a test alert
        self.alert = Alert.objects.create(rule=self.rule, event=self.event, severity='INFO')

    def test_create_alert(self):
        url = reverse('alert-list')
        data = {
            'rule': self.rule.id,
            'event': self.event.id,
            'severity': 'HIGH',
            'comments': 'Test Comment'
        }
        self.client.login(username='testuser', password='testpass')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Alert.objects.count(), 2)  # 1 existing + 1 new

    def test_assign_alert(self):
        url = reverse('alert-assign', args=[self.alert.id])
        self.client.login(username='testuser', password='testpass')
        
        # Create an analyst user to assign the alert to
        analyst = User.objects.create_user(username='analyst', password='analystpass')

        response = self.client.post(url, {'assigned_to': analyst.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(InvestigateAlert.objects.count(), 1)

    def test_latest_alerts(self):
        url = reverse('alert-latest_alerts')
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only one alert should be returned

class InvestigateAlertViewSetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.rule = Rule.objects.create(name='Test Rule', description='Test Description')
        self.event = BronzeEventData.objects.create(EventID='E123', UserID='U123', hostname='localhost')
        self.alert = Alert.objects.create(rule=self.rule, event=self.event, severity='INFO')
        self.investigate_alert = InvestigateAlert.objects.create(alert=self.alert, assigned_to=self.user)

    def test_investigation_status_count(self):
        url = reverse('investigatealert-investigation_status_count')
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['open_count'], 1)  # One open investigation created

        # Create another InvestigateAlert with different status
        self.investigate_alert.status = 'CLOSED'
        self.investigate_alert.save()

        response = self.client.get(url)
        self.assertEqual(response.data['closed_count'], 1)  # One closed investigation should be counted
        self.assertEqual(response.data['open_count'], 0)  # Open count should now be zero

