
# core/tests/test_serializers.py

from rest_framework.exceptions import ValidationError
from django.test import TestCase
from core.models import Rule
from core.serializers import RuleSerializer

class RuleSerializerTest(TestCase):
    def setUp(self):
        self.valid_data = {
            'name': 'Test Rule',
            'description': 'Description of the test rule',
            'conditions': 'if x > 5 then alert',
        }
        self.serializer = RuleSerializer(data=self.valid_data)

    def test_valid_serializer(self):
        self.assertTrue(self.serializer.is_valid())

    def test_invalid_serializer(self):
        self.serializer = RuleSerializer(data={})  # No data
        with self.assertRaises(ValidationError):
            self.serializer.is_valid(raise_exception=True)
