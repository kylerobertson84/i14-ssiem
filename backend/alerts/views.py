from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Alert, AssignedAlert
from .serializers import AlertSerializer, AssignedAlertSerializer
from utils.pagination import StandardResultsSetPagination

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status', 'severity', 'rule__rule_name']
    ordering_fields = ['timestamp', 'severity']
    search_fields = ['event__source__hostname', 'event__source__account_name']

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        alert = self.get_object()
        user = request.user
        assigned_alert, created = AssignedAlert.objects.get_or_create(alert=alert, user=user)
        if created:
            return Response({'status': 'Alert assigned successfully'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'Alert was already assigned to this user'}, status=status.HTTP_200_OK)

class AssignedAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AssignedAlert.objects.all()
    serializer_class = AssignedAlertSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user__username', 'alert__status', 'alert__severity']
    ordering_fields = ['alert__timestamp']