from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

from utils.baseViewThrottle import BaseViewThrottleSet
from .models import IncidentReport
from .serializers import IncidentReportSerializer
from utils.pagination import StandardResultsSetPagination

class IncidentReportViewSet(BaseViewThrottleSet):
    queryset = IncidentReport.objects.all()
    serializer_class = IncidentReportSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['type', 'status', 'user__username']
    ordering_fields = ['created_at']
    search_fields = ['description', 'source__hostname']