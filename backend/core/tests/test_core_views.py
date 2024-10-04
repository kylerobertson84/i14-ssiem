
# core/tests/test_views.py

import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import Rule
from core.serializers import RuleSerializer
from rest_framework.test import APIClient
from accounts.models import User, Role
from django.contrib.auth import get_user_model

User = get_user_model()

class RuleViewSetTest(APITestCase):

    def setUp(self):

        self.client = APIClient()

        admin_role, created = Role.objects.get_or_create(name=Role.ADMIN)
        self.admin_user = User.objects.create_user(email='admin@test.com', password='password', role=admin_role)
        self.client.force_authenticate(user=self.admin_user) 
       
        self.rules = [
            {
                "name": "Multiple Failed Logins",
                "description": "Detects multiple failed login attempts within a short timeframe in either Application or Security channels",
                "conditions": json.dumps({
                    "EventID": "4625",
                    "frequency": {
                        "count": 5,
                        "timeframe": "5m"
                    },
                    "Channel": ["Application", "Security"]
                }),
                "severity": "HIGH"
            },
            {
                "name": "After-hours Login",
                "description": "Detects successful logins outside of normal business hours",
                "conditions": json.dumps({
                    "EventID": 4624,
                    "time_range": {
                        "start": "18:00",
                        "end": "06:00"
                    }
                }),
                "severity": "MEDIUM"
            },
          
        ]

       
        for rule in self.rules:
            Rule.objects.create(
                name=rule['name'],
                description=rule['description'],
                conditions=rule['conditions'],
                severity=rule['severity']
            )

    def test_get_rules(self):
        url = reverse('rule-list')  
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.rules))

       
        expected_rule = self.rules[0]
        self.assertEqual(response.data[0]['name'], expected_rule['name'])
        self.assertEqual(response.data[0]['description'], expected_rule['description'])
        self.assertEqual(response.data[0]['conditions'], expected_rule['conditions'])
    

    def test_create_rule(self):
        url = reverse('rule-list')  
        new_rule = {
            "name": "New Test Rule",
            "description": "A test rule for creating new rules",
            "conditions": json.dumps({
                "EventID": 1234,
                "Channel": "Test"
            }),
            "severity": "LOW"
        }
        response = self.client.post(url, new_rule, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rule.objects.count(), len(self.rules) + 1)  
        self.assertEqual(Rule.objects.last().name, new_rule['name'])

    def test_update_rule(self):
        rule_to_update = Rule.objects.get(name="Multiple Failed Logins")
        url = reverse('rule-detail', args=[rule_to_update.id])  

        updated_data = {
            "name": "Updated Rule",
            "description": "An updated description",
            "conditions": json.dumps({
                "EventID": "4625",
                "frequency": {
                    "count": 10,
                    "timeframe": "10m"
                },
                "Channel": ["Application", "Security"]
            }),
            "severity": "CRITICAL"
        }
        response = self.client.put(url, updated_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rule_to_update.refresh_from_db()
        self.assertEqual(rule_to_update.name, updated_data['name'])
        self.assertEqual(rule_to_update.description, updated_data['description'])

    def test_delete_rule(self):
        rule_to_delete = Rule.objects.get(name="After-hours Login")
        url = reverse('rule-detail', args=[rule_to_delete.id])  

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Rule.objects.count(), len(self.rules) - 1)  
