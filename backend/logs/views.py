
# logs/views.py
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import BronzeEventData, EventData, RouterData
from .serializers import BronzeEventDataSerializer, EventDataSerializer, RouterDataSerializer, LogCountSerializer
from utils.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django.db.models.functions import TruncHour
from django.db.models import Count

# from rest_framework.authentication import TokenAuthentication

class BronzeEventDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BronzeEventData.objects.all()
    serializer_class = BronzeEventDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    # filterset_fields = ['event_type', 'severity', 'hostname']
    ordering_fields = ['event_time', 'event_id']
    search_fields = ['hostname', 'account_name', 'message']
    permission_classes = [IsAuthenticated] 
    # authentication_classes = [TokenAuthentication]

    # method to get the total number of rows
    @action(detail=False, methods=['get'])
    def count(self, request):
        print('Request headers:', request.headers)  # Debugging line
        print('Request user:', request.user)  # Check the user
        count = self.queryset.count()
        return Response({'count': count})

class EventDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventData.objects.all()
    serializer_class = EventDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    # filterset_fields = ['source__event_type', 'rule__rule_name']
    ordering_fields = ['timestamp']
    search_fields = ['source__hostname', 'source__account_name']
    permission_classes = [IsAuthenticated] 

class RouterDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RouterData.objects.all()
    serializer_class = RouterDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends =  [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['date_time']
    search_fields = ['severity','hostname']
    permission_classes = [IsAuthenticated] 

    @action(detail=False, methods=['get'])
    def router_log_count(self, request):
        router_log_count = self.queryset.count()
        return Response({'router_log_count': router_log_count})

class LogPercentageViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def log_percentages(self, request):
        bronze_event_data_count = BronzeEventData.objects.count()
        router_data_count = RouterData.objects.count()
        total_log_count = bronze_event_data_count + router_data_count

        if total_log_count > 0:
            data = {
                'windows_os_percentage': (bronze_event_data_count / total_log_count) * 100,
                'network_percentage': (router_data_count / total_log_count) * 100,
            }
        else:
            data = {
                'windows_os_percentage': 0,
                'network_percentage': 0,
            }

        serializer = LogCountSerializer(data)
        return Response(serializer.data)

class LogAggregationViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def logs_per_hour(self, request):
        # Aggregate BronzeEventData logs per hour
        bronze_event_data = (
            BronzeEventData.objects
            .annotate(hour=TruncHour('iso_timestamp'))
            .values('hour')
            .annotate(count=Count('id'))
            .order_by('hour')
        )

        # Aggregate RouterData logs per hour
        router_data = (
            RouterData.objects
            .annotate(hour=TruncHour('date_time'))
            .values('hour')
            .annotate(count=Count('id'))
            .order_by('hour')
        )

        # Format data for the chart
        data = []
        hours = sorted(set(
            [entry['hour'] for entry in bronze_event_data] +
            [entry['hour'] for entry in router_data]
        ))

        for hour in hours:
            bronze_count = next((item['count'] for item in bronze_event_data if item['hour'] == hour), 0)
            router_count = next((item['count'] for item in router_data if item['hour'] == hour), 0)
            data.append({
                'name': hour.strftime('%Y-%m-%d %H:%M:%S'),
                'Computer': bronze_count,
                'Networking': router_count,
            })

        return Response(data)