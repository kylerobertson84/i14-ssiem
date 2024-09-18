from rest_framework import filters, status
from rest_framework.decorators import action
from django.http import HttpResponse
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter, DateTimeFilter
from utils.baseViewThrottle import BaseViewThrottleSet
from .models import IncidentReport, Rule
from .serializers import IncidentReportSerializer, RuleSerializer
from utils.pagination import StandardResultsSetPagination
from .pdf_generator import generate_pdf

class IncidentReportFilter(FilterSet):
    user__email = CharFilter(field_name='user__email', lookup_expr='icontains')
    last_update = DateTimeFilter(field_name='updated_at', lookup_expr='gte')

    class Meta:
        model = IncidentReport
        fields = ['type', 'status', 'user__email', 'last_update']

class IncidentReportViewSet(BaseViewThrottleSet):
    queryset = IncidentReport.objects.all()
    serializer_class = IncidentReportSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = IncidentReportFilter
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['title', 'description', 'source__hostname', 'rules__name', 'custom_rules']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def generate_pdf(self, request, pk=None):
        incident_report = self.get_object()
        pdf_content = generate_pdf(incident_report)
        
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="incident_report_{incident_report.id}.pdf"'
        return response
    
    @action(detail=True, methods=['delete'])
    def delete_report(self, request, pk=None):
        try:
            report = self.get_object()
            report.delete()
            return Response({"message": "Report deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except IncidentReport.DoesNotExist:
            return Response({"message": "Report not found"}, status=status.HTTP_404_NOT_FOUND)