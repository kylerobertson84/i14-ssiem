from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import IncidentReport
from .serializers import IncidentReportSerializer

class IncidentReportViewSet(viewsets.ModelViewSet):
    queryset = IncidentReport.objects.all()
    serializer_class = IncidentReportSerializer
    permission_classes = [IsAuthenticated]