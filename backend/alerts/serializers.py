from rest_framework import serializers
from .models import Alert, AssignedAlert
from logs.serializers import EventDataSerializer
from core.serializers import RuleSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email']

class AlertSerializer(serializers.ModelSerializer):
    event = EventDataSerializer(read_only=True)
    rule = RuleSerializer(read_only=True)

    class Meta:
        model = Alert
        fields = '__all__'

class AssignedAlertSerializer(serializers.ModelSerializer):
    alert = AlertSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = AssignedAlert
        fields = '__all__'