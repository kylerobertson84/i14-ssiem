
# tests/test_serializers.py

from django.test import TestCase
from logs.serializers import BronzeEventDataSerializer, RouterDataSerializer
from logs.models import BronzeEventData, RouterData

class BronzeEventDataSerializerTest(TestCase):
    def test_serialization(self):
        event_data = BronzeEventData.objects.create(
            hostname="test-host",
            EventType="EventType1",
            iso_timestamp="2023-09-01T12:00:00Z",
            EventID=1111,
            AccountName='test-account',
            message='a message string'
        )
        serializer = BronzeEventDataSerializer(event_data)
        expected_data = {
            'id': event_data.id,
            'iso_timestamp': "2023-09-01T12:00:00Z",
            'hostname': "test-host",
            'EventType': "EventType1",
            'EventID': '1111',
            'AccountName': 'test-account',
            'message': 'a message string',
        }
        self.assertEqual(serializer.data, expected_data)

class RouterDataSerializerTest(TestCase):
    def test_serialization(self):
        router_data = RouterData.objects.create(
            hostname="router-host",
            process="router-process",
            date_time="2023-09-01 12:00:00",
            message='a message string',
        )
        serializer = RouterDataSerializer(router_data)
        expected_data = {
            'id': router_data.id,
            'date_time': "2023-09-01 12:00:00",
            'hostname': "router-host",
            'process': "router-process",
            'message': "a message string"
        }
        self.assertEqual(serializer.data, expected_data)
