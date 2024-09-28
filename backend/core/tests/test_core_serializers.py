
# core/tests/test_serializers.py

from rest_framework.exceptions import ValidationError
from django.test import TestCase
from core.models import Rule
from core.serializers import RuleSerializer
import json

class RuleModelTest(TestCase):
    
    def setUp(self):
        
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

    def test_str_method(self):
        rule = Rule.objects.get(name="Multiple Failed Logins")
        self.assertEqual(str(rule), "Multiple Failed Logins - HIGH")

    def test_rule_serializer(self):
        rule = Rule.objects.get(name="After-hours Login")
        serializer = RuleSerializer(rule)
        expected_data = {
            'id': rule.id,
            'name': rule.name,
            'description': rule.description,
            'conditions': rule.conditions,
        }
        self.assertEqual(serializer.data, expected_data)
