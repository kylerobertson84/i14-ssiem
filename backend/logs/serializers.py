# logs/serializers.py
from rest_framework import serializers
from .models import BronzeEventData, EventData, RouterData
from core.serializers import RuleSerializer

class BronzeEventDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BronzeEventData
        fields = '__all__'

class EventDataSerializer(serializers.ModelSerializer):
    # source = BronzeEventDataSerializer(read_only=True)
    rule = RuleSerializer(read_only=True)
    
    class Meta:
        model = EventData
        fields = '__all__'

    # Omit this method for now due to source not using
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['source'] = BronzeEventDataSerializer(instance.source).data
    #     return representation

class RouterDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouterData
        fields = '__all__'


class LogCountSerializer(serializers.Serializer):
    bronze_event_data_count = serializers.IntegerField()
    router_data_count = serializers.IntegerField()
    total_count = serializers.IntegerField()