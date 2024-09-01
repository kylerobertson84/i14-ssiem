from rest_framework import serializers
from .models import Alert, InvestigateAlert
from logs.models import BronzeEventData
from core.models import Rule
from django.contrib.auth import get_user_model

User = get_user_model()

class AlertUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'email']

class AlertBronzeEventDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BronzeEventData
        fields = ['id', 'EventID', 'UserID']

class AlertRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ['id', 'name']

class AlertSerializer(serializers.ModelSerializer):
    event_id = AlertBronzeEventDataSerializer(source='event', read_only=True)
    rule_id = AlertRuleSerializer(source='rule', read_only=True)

    class Meta:
        model = Alert
        fields = ['alert_id', 'event', 'created_at', 'rule', 'severity', 'comments']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['event'] = {
            'EventID': representation['event']['EventID'],
            'UserID': representation['event']['UserID']
        }
        representation['rule'] = representation['rule']['name']
        return representation

class InvestigateAlertSerializer(serializers.ModelSerializer):
    alert = AlertSerializer(read_only=True)
    assigned_to = AlertUserSerializer(read_only=True)

    class Meta:
        model = InvestigateAlert
        fields = ['investigation_id', 'alert', 'assigned_to', 'status', 'notes', 'created_at', 'updated_at']