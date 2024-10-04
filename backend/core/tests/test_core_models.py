
# core/tests/test_models.py

from django.test import TestCase
from core.models import Rule

class RuleModelTest(TestCase):
    def setUp(self):
        self.rule = Rule.objects.create(
            name='Sample Rule',
            description='A test rule description',
            conditions='if x > 10 then alert',
            severity='HIGH'
        )

    def test_rule_creation(self):
        self.assertEqual(self.rule.name, 'Sample Rule')
        self.assertEqual(self.rule.severity, 'HIGH')

    def test_str_method(self):
        self.assertEqual(str(self.rule), 'Sample Rule - HIGH')
