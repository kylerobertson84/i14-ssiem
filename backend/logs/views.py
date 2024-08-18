# logs/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import BronzeEventData, EventData
from .serializers import BronzeEventDataSerializer, EventDataSerializer
from utils.pagination import StandardResultsSetPagination

class BronzeEventDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BronzeEventData.objects.all()
    serializer_class = BronzeEventDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    # filterset_fields = ['event_type', 'severity', 'hostname']
    ordering_fields = ['event_time', 'event_id']
    search_fields = ['hostname', 'account_name', 'message']

class EventDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventData.objects.all()
    serializer_class = EventDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    # filterset_fields = ['source__event_type', 'rule__rule_name']
    ordering_fields = ['timestamp']
    search_fields = ['source__hostname', 'source__account_name']