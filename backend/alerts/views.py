from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from rest_framework.permissions import IsAuthenticated 
from utils.baseViewThrottle import BaseViewThrottleSet
from .models import Alert, InvestigateAlert, InvestigationStatus
from .serializers import AlertSerializer, InvestigateAlertSerializer
from utils.pagination import StandardResultsSetPagination
from accounts.models import User

class AlertFilter(FilterSet):
    rule__name = CharFilter(field_name='rule__name', lookup_expr='icontains')

    class Meta:
        model = Alert
        fields = ['severity', 'rule__name']


class InvestigateAlertFilter(FilterSet):
    assigned_to__email = CharFilter(field_name='assigned_to__email', lookup_expr='icontains')
    alert__severity = CharFilter(field_name='alert__severity', lookup_expr='iexact')

    class Meta:
        model = InvestigateAlert
        fields = ['assigned_to__email', 'alert__severity', 'status']


class BaseAlertViewSet(BaseViewThrottleSet):
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]


class AlertViewSet(BaseAlertViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    filterset_class = AlertFilter
    ordering_fields = ['created_at', 'severity']
    search_fields = ['event__EventID', 'event__UserID', 'event__hostname', 'rule__name']

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        alert = self.get_object()
        
        assigned_to_id = request.data.get('assigned_to')
        if not assigned_to_id:
            return Response({'error': 'No analyst ID provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            assigned_to = User.objects.get(pk=assigned_to_id)
        except User.DoesNotExist:
            return Response({'error': 'Analyst not found'}, status=status.HTTP_404_NOT_FOUND)
        
        investigate_alert, created = InvestigateAlert.objects.get_or_create(
            alert=alert,
            defaults={'assigned_to': assigned_to}
        )
        
        if created:
            return Response({'status': 'Alert assigned successfully'}, status=status.HTTP_201_CREATED)
        else:
            investigate_alert.assigned_to = assigned_to
            investigate_alert.save()
            return Response({'status': 'Alert reassigned successfully'}, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=['get'])
    def latest_alerts(self, request):
        latest_alerts = self.queryset.order_by('-created_at')[:4]
        page = self.paginate_queryset(latest_alerts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(latest_alerts, many=True)
        return Response(serializer.data)


class InvestigateAlertViewSet(BaseAlertViewSet):
    queryset = InvestigateAlert.objects.all()
    serializer_class = InvestigateAlertSerializer
    filterset_class = InvestigateAlertFilter 
    ordering_fields = ['created_at', 'updated_at']

    @action(detail=False, methods=['get'])
    def investigation_status_count(self, request):
        closed_count = InvestigateAlert.objects.filter(status=InvestigationStatus.CLOSED).count()
        open_count = InvestigateAlert.objects.filter(status=InvestigationStatus.OPEN).count()
        in_progress_count = InvestigateAlert.objects.filter(status=InvestigationStatus.IN_PROGRESS).count()

        return Response({
            'closed_count': closed_count,
            'open_count': open_count,
            'in_progress_count': in_progress_count,
        })
    
class LatestAlertView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest_alert = Alert.objects.filter(user=request.user).order_by('-created_at').first()
        if latest_alert:
            return Response({
                'has_alert': True,
                'alert_name' : latest_alert.hostname,
                'alert_message': latest_alert.message,
                'alert_level': latest_alert.severity
            })
        return Response({'has_alert': False})