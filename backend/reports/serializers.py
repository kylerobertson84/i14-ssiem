from rest_framework import serializers
from .models import IncidentReport
from core.models import Rule
from core.serializers import RuleSerializer
from logs.serializers import BronzeEventDataSerializer

from typing import List, Optional
from django.db.models import Model
from rest_framework.request import Request
from drf_spectacular.utils import extend_schema_field

from django.contrib.auth import get_user_model


User = get_user_model()

class IncidentReportUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'email']

class IncidentReportRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ['id', 'name', 'description', 'severity']

class IncidentReportSerializer(serializers.ModelSerializer):
    source = BronzeEventDataSerializer(read_only=True)
    user = IncidentReportUserSerializer(read_only=True)
    rules = IncidentReportRuleSerializer(many=True, read_only=True)
    pdf_url = serializers.SerializerMethodField()
    rule_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Rule.objects.all(), write_only=True, source='rules')

    class Meta:
        model = IncidentReport
        fields = '__all__'

    @extend_schema_field({"type": "string", "format": "uri", "nullable": True})
    def get_pdf_url(self, obj: Model) -> Optional[str]:
        if obj.pdf_file:
            return self.context['request'].build_absolute_uri(obj.pdf_file.url)
        return None

    def create(self, validated_data):
        rules = validated_data.pop('rules', [])
        incident_report = IncidentReport.objects.create(**validated_data)
        incident_report.rules.set(rules)
        return incident_report

    def update(self, instance, validated_data):
        rules = validated_data.pop('rules', None)
        if rules is not None:
            instance.rules.set(rules)
        return super().update(instance, validated_data)