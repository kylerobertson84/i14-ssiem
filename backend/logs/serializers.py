from rest_framework import serializers
from .models import BronzeEventData, RouterData

class BronzeEventDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BronzeEventData
        fields = ['id', 'iso_timestamp', 'hostname', 'EventType', 'EventID', 'AccountName', 'message']

class RouterDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouterData
        fields = ['id', 'date_time', 'hostname', 'process', 'message']
# class EventDataSerializer(serializers.ModelSerializer):
#     # source = BronzeEventDataSerializer(read_only=True)
#     rule = RuleSerializer(read_only=True)
    
#     class Meta:
#         model = EventData
#         fields = '__all__'

    # Omit this method for now due to source not using
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['source'] = BronzeEventDataSerializer(instance.source).data
    #     return representation

class LogCountSerializer(serializers.Serializer):
    windows_os_percentage = serializers.FloatField()
    network_percentage = serializers.FloatField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['windows_os_percentage'] = round(representation['windows_os_percentage'], 2)
        representation['network_percentage'] = round(representation['network_percentage'], 2)
        return representation

