
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from alerts.models import Alert, InvestigateAlert, AlertSeverity
from logs.models import BronzeEventData
from core.models import Rule
from accounts.models import User, Role
from alerts.serializers import AlertSerializer, InvestigateAlertSerializer
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class AlertViewSetTest(APITestCase):
    
    def setUp(self):
        
        admin_role, created = Role.objects.get_or_create(name=Role.ADMIN)
        analyst_role, created = Role.objects.get_or_create(name=Role.ANALYST)

        a_rule = {
                "name": "Sensitive Group Modified",
                "description": "Detects when a sensitive group (e.g., Administrators) is modified",
                "conditions": json.dumps({
                    "EventID": [4728, 4729, 4732, 4756],
                    "Channel": "Security",
                    "TargetUserName": ["Administrators", "Domain Admins", "Enterprise Admins"] 
                }),
                "severity": "HIGH"
            }
        
        self.rule = Rule.objects.create(**a_rule)
        
        self.analyst_user = User.objects.create_user(email='analyst@test.com', password='password', role=analyst_role)

        self.admin_user = User.objects.create_user(email='admin@test.com', password='password', role=admin_role)

       
        self.client.force_authenticate(user=self.analyst_user)

        self.event = BronzeEventData.objects.create(EventType="Test Event", message="a message")
        
        self.alert = Alert.objects.create(rule=self.rule, event=self.event, severity=self.rule.severity)
        self.url = reverse('alert-list') 

    # def test_create_alert(self):
    #     data = {
    #         'rule': self.rule.id,  
    #         'event': self.event.id,  
    #         'severity': self.rule.severity,
    #         'comments': 'New test comment',
    #     }
        
    #     print(f"Rule ID: {self.rule.id}")  
    #     print(f"Event ID: {self.event.id}")  

    #     response = self.client.post(self.url, data, format='json')

    #     # print(response.data)

    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Alert.objects.count(), 2) 

    def test_assign_alert(self):
        assign_url = reverse('alert-assign', kwargs={'pk': self.alert.id})  
        response = self.client.post(assign_url, {'assigned_to': self.analyst_user.user_id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        investigate_alert = InvestigateAlert.objects.first()
        self.assertIsNotNone(investigate_alert)
        self.assertEqual(investigate_alert.assigned_to, self.analyst_user)

    def test_assign_alert_no_user(self):
        assign_url = reverse('alert-assign', kwargs={'pk': self.alert.id})
        response = self.client.post(assign_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'No analyst ID provided')

    def test_latest_alerts(self):
        latest_url = reverse('alert-latest-alerts')
        response = self.client.get(latest_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)


class InvestigateAlertViewSetTest(APITestCase):
    
    def setUp(self):
       
        analyst_role, created = Role.objects.get_or_create(name=Role.ANALYST)
        self.user = User.objects.create_user(email='test@example.com', password='password', role=analyst_role)
        
        
        self.event_data = BronzeEventData.objects.create(EventID='1', UserID='user1', hostname='host1')
        self.rule = Rule.objects.create(name='Test Rule')
        self.alert = Alert.objects.create(event=self.event_data, rule=self.rule, severity='High', comments='Test comment')
        self.investigate_alert = InvestigateAlert.objects.create(alert=self.alert, assigned_to=self.user, status='OPEN', notes='Notes here')
        
        
        self.client.force_authenticate(user=self.user)  
        self.url = reverse('investigatealert-list') 

    def test_investigation_status_count(self):
        status_url = reverse('investigatealert-investigation-status-count') 
        response = self.client.get(status_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('closed_count', response.data)
        self.assertIn('open_count', response.data)
        self.assertIn('in_progress_count', response.data)


