from rest_framework import serializers
from .models import Rule, Alert, AssignedAlert

class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = '__all__'

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'

class AssignedAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedAlert
        fields = '__all__'