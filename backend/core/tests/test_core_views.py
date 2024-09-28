
# core/tests/test_views.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import Rule
from django.contrib.auth import get_user_model

User = get_user_model()

class RuleViewSetTest(APITestCase):
    def setUp(self):
        self.url = reverse('rule-list') 
        self.user = User.objects.create_user(email='user@test.com', password='password')
        self.client.force_authenticate(user=self.user)

    def test_create_rule(self):
        data = {
            'name': 'New Rule',
            'description': 'This is a new rule',
            'conditions': 'if y < 10 then alert',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rule.objects.count(), 1)
        self.assertEqual(Rule.objects.get().name, 'New Rule')

    def test_list_rules(self):
        Rule.objects.create(name='Test Rule', description='Desc', conditions='x == 5')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  
