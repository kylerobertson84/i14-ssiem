
# tests/test_models.py

from django.test import TestCase
from logs.models import BronzeEventData, RouterData

class BronzeEventDataModelTest(TestCase):
    def test_create_bronze_event_data(self):
        event = BronzeEventData.objects.create(
            app_name="test-app-name",
            EventType="EventType1",
            iso_timestamp="2023-09-01T12:00:00Z"
        )
        self.assertEqual(str(event), "2023-09-01T12:00:00Z - test-app-name - EventType1")
        self.assertEqual(event.EventType, "EventType1")

class RouterDataModelTest(TestCase):
    def test_create_router_data(self):
        router_data = RouterData.objects.create(
            hostname="router-host",
            process="router-process",
            date_time="2023-09-01 12:00:00"
        )
        self.assertEqual(str(router_data), "2023-09-01 12:00:00 - router-host - router-process")
