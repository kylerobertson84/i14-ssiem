from rest_framework import filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from utils.baseViewThrottle import BaseViewThrottleSet
from .models import IncidentReport, Rule
from .serializers import IncidentReportSerializer, RuleSerializer
from utils.pagination import StandardResultsSetPagination
from .pdf_generator import generate_pdf

class IncidentReportFilter(FilterSet):
    user__email = CharFilter(field_name='user__email', lookup_expr='icontains')

    class Meta:
        model = IncidentReport
        fields = ['type', 'status', 'user__email']

class IncidentReportViewSet(BaseViewThrottleSet):
    queryset = IncidentReport.objects.all()
    serializer_class = IncidentReportSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = IncidentReportFilter
    ordering_fields = ['created_at']
    search_fields = ['description', 'source__hostname', 'rules__name', 'custom_rules']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def generate_pdf(self, request, pk=None):
        incident_report = self.get_object()
        pdf_file = generate_pdf(incident_report)
        incident_report.pdf_file = pdf_file
        incident_report.save()
        return Response({'message': 'PDF generated successfully'}, status=status.HTTP_200_OK)
