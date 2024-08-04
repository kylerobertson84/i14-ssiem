from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Rule, Alert, AssignedAlert
from .serializers import RuleSerializer, AlertSerializer, AssignedAlertSerializer

class RuleViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer
    permission_classes = [IsAuthenticated]

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]

class AssignedAlertViewSet(viewsets.ModelViewSet):
    queryset = AssignedAlert.objects.all()
    serializer_class = AssignedAlertSerializer
    permission_classes = [IsAuthenticated]