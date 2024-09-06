from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from utils.baseViewThrottle import BaseViewThrottleSet
from .models import Alert, InvestigateAlert, InvestigationStatus
from .serializers import AlertSerializer, InvestigateAlertSerializer
from utils.pagination import StandardResultsSetPagination
from accounts.permissions import HasRolePermission, IsAdminUser
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

class AlertPermission(HasRolePermission):
    def has_permission(self, request, view):
        # Allow read-only access for all users
        if view.action in ['list', 'retrieve', 'latest_alerts']:
            return True
        
        # For other actions, use the existing role-based permissions
        if not super().has_permission(request, view):
            return False
        
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user.role.has_permission('manage_roles')
        
        return False

class InvestigateAlertPermission(HasRolePermission):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        if view.action in ['list', 'retrieve', 'investigation_status_count']:
            return request.user.role.has_permission('view_reports')
        elif view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user.role.has_permission('create_reports')
        return False

class BaseAlertViewSet(BaseViewThrottleSet):
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    def get_permissions(self):
        permission_classes = self.permission_classes or [IsAuthenticated] 
        return [permission() for permission in permission_classes]
    

class AlertViewSet(BaseAlertViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_class = [AlertPermission]
    filterset_class = AlertFilter
    ordering_fields = ['created_at', 'severity']
    search_fields = ['event__EventID', 'event__UserID', 'event__hostname', 'rule__name']

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign(self, request, pk=None):
        # Only allow admins to assign alerts
        alert = self.get_object()
        
        # Retrieve the analyst ID from the request data
        assigned_to_id = request.data.get('assigned_to')
        if not assigned_to_id:
            return Response({'error': 'No analyst ID provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get the analyst user object
            assigned_to = User.objects.get(pk=assigned_to_id)
        except User.DoesNotExist:
            return Response({'error': 'Analyst not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create or update InvestigateAlert for the alert
        investigate_alert, created = InvestigateAlert.objects.get_or_create(
            alert=alert,
            defaults={'assigned_to': assigned_to}
        )
        
        if created:
            return Response({'status': 'Alert assigned successfully'}, status=status.HTTP_201_CREATED)
        else:
            # Update the assignment if already exists
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
    permission_classes = [IsAuthenticated]
    filterset_class = InvestigateAlertFilter 
    ordering_fields = ['created_at', 'updated_at']


    @action(detail=False, methods=['get'])
    def investigation_status_count(self, request):

        closed_count = InvestigateAlert.objects.filter(status=InvestigationStatus.CLOSED).count()
        other_status_count = InvestigateAlert.objects.exclude(status=InvestigationStatus.CLOSED).count()

        return Response({
            'closed_count': closed_count,
            'other_status_count': other_status_count
        })

# Additional utility functions for checking permissions
def user_can_view_alerts(user):
    return user.is_authenticated and user.role and user.role.has_permission('view_reports')

def user_can_manage_alerts(user):
    return user.is_authenticated and user.role and user.role.has_permission('manage_roles')