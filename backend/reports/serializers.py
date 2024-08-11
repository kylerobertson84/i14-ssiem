from rest_framework import serializers
from .models import IncidentReport
from logs.serializers import BronzeEventDataSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email']

class IncidentReportSerializer(serializers.ModelSerializer):
    source = BronzeEventDataSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = IncidentReport
        fields = '__all__'