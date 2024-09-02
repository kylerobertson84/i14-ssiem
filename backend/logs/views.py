from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from alerts.models import Alert
from .models import BronzeEventData, RouterData
from .serializers import BronzeEventDataSerializer, RouterDataSerializer, LogCountSerializer
from utils.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django.db.models.functions import TruncHour, TruncDay
from django.db.models import Count
from django.utils import timezone
import pytz
import logging

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

# class EventDataViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = EventData.objects.all()
#     serializer_class = EventDataSerializer
#     pagination_class = StandardResultsSetPagination
#     filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
#     # filterset_fields = ['source__event_type', 'rule__rule_name']
#     ordering_fields = ['timestamp']
#     search_fields = ['source__hostname', 'source__account_name']
#     permission_classes = [IsAuthenticated] 

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
    serializer_class = LogCountSerializer

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

        serializer = self.serializer_class(data)
        return Response(serializer.data)

class LogAggregationViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def logs_per_hour(self, request):
        # Aggregate BronzeEventData logs per hour
        bronze_event_data = (
            BronzeEventData.objects
            .annotate(hour=TruncHour('created_at'))
            .values('hour')
            .annotate(count=Count('id'))
            .order_by('hour')
        )

        # Aggregate RouterData logs per hour
        router_data = (
            RouterData.objects
            .annotate(hour=TruncHour('created_at'))
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
                # 'name': hour.strftime('%Y-%m-%d %H:%M:%S'),
                'name': hour.strftime('%H:%M:%S'),
                'Computer': bronze_count,
                'Networking': router_count,
            })

        return Response(data)
    
logger = logging.getLogger(__name__)

class EventsToday(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def events_today(self, request):
        # Define local timezone
        local_timezone = pytz.timezone('Australia/Melbourne')

        # Get current time in local timezone
        now_local = timezone.localtime(timezone.now(), local_timezone)
        today_start_local = now_local.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end_local = now_local.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Convert local times to UTC
        today_start_utc = today_start_local.astimezone(pytz.UTC)
        today_end_utc = today_end_local.astimezone(pytz.UTC)

        # Log the UTC start and end of today
        logger.debug(f"UTC Start of today: {today_start_utc}")
        logger.debug(f"UTC End of today: {today_end_utc}")

        # Filter EventData by UTC datetime range
        event_today_count = Alert.objects.filter(timestamp__range=(today_start_utc, today_end_utc)).count()

        data = {
            'events_today': event_today_count
        }
        return Response(data)
        
