from io import BytesIO
from datetime import datetime
import logging
import pytz

from .pdf_exports import generate_pdf_report

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from alerts.models import Alert
from .models import BronzeEventData, RouterData
from .serializers import BronzeEventDataSerializer, RouterDataSerializer, LogCountSerializer
from utils.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated


from django.db.models.functions import TruncHour, TruncDay
from django.db.models import Count, Q
from django.utils import timezone
from dateutil.parser import parse as parse_datetime

from utils.baseViewThrottle import BaseViewThrottleSet

# from rest_framework.authentication import TokenAuthentication

class BronzeEventDataViewSet(viewsets.ReadOnlyModelViewSet, BaseViewThrottleSet):
    queryset = BronzeEventData.objects.all()
    serializer_class = BronzeEventDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['iso_timestamp', 'event_id']
    search_fields = ['hostname', 'AccountName', 'message']
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('query')
        start_time = self.request.query_params.get('start_time')
        end_time = self.request.query_params.get('end_time')
        event_type = self.request.query_params.get('event_type')
        


        if query:
            queryset = queryset.filter(
                Q(hostname__icontains=query) |
                Q(AccountName__icontains=query) |
                Q(message__icontains=query)
            )
        
        if start_time:
            start_datetime = parse_datetime(start_time)
            queryset = queryset.filter(iso_timestamp__gte=start_datetime)
        
        if end_time:
            end_datetime = parse_datetime(end_time)
            queryset = queryset.filter(iso_timestamp__lte=end_datetime)
        
        if event_type:
            queryset = queryset.filter(EventType=event_type)

        return queryset

    @action(detail=False, methods=['get'])
    def export_pdf(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        columns = [
            ('Timestamp', 'iso_timestamp'),
            ('Hostname', 'hostname'),
            ('Event Type', 'EventType'),
            ('Event ID', 'EventID'),
            ('Account Name', 'AccountName'),
            #('Message', 'message'),
        ]
        return generate_pdf_report(queryset, "BronzeEventData", columns)
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        # print('Request headers:', request.headers)  # Debugging line
        # print('Request user:', request.user)  # Check the user
        count = self.queryset.count()
        return Response({'count': count})

class RouterDataViewSet(viewsets.ReadOnlyModelViewSet, BaseViewThrottleSet):
    queryset = RouterData.objects.all()
    serializer_class = RouterDataSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['date_time']
    search_fields = ['hostname', 'process', 'message']
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('query')
        start_time = self.request.query_params.get('start_time')
        end_time = self.request.query_params.get('end_time')
        process = self.request.query_params.get('process')

        if query:
            queryset = queryset.filter(
                Q(hostname__icontains=query) |
                Q(message__icontains=query)
            )
        
        if start_time:
            start_datetime = parse_datetime(start_time)
            queryset = queryset.filter(date_time__gte=start_datetime)
        
        if end_time:
            end_datetime = parse_datetime(end_time)
            queryset = queryset.filter(date_time__lte=end_datetime)
        
        if process:
            queryset = queryset.filter(process=process)
        
        if queryset.count() > 20000:
            recent_logs = timezone.now() - timezone.timedelta(days=30)
            queryset = queryset.filter(date_time__gte=recent_logs)

        return queryset
    
    @action(detail=False, methods=['get'])
    def router_log_count(self, request):
        router_log_count = self.queryset.count()
        return Response({'router_log_count': router_log_count})

    @action(detail=False, methods=['get'])
    def export_pdf(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        columns = [
            ('Timestamp', 'date_time'),
            ('Hostname', 'hostname'),
            ('Process', 'process'),
            #('Message', 'message'),
        ]
        return generate_pdf_report(queryset, "RouterData", columns)


class LogPercentageViewSet(viewsets.ViewSet, BaseViewThrottleSet):
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

class LogAggregationViewSet(viewsets.ViewSet, BaseViewThrottleSet):
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

class EventsToday(viewsets.ViewSet, BaseViewThrottleSet):
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
        #logger.debug(f"UTC Start of today: {today_start_utc}")
        #logger.debug(f"UTC End of today: {today_end_utc}")

        # Filter EventData by UTC datetime range
        event_today_count = Alert.objects.filter(created_at__range=(today_start_utc, today_end_utc)).count()

        data = {
            'events_today': event_today_count
        }
        return Response(data)

        
class HostnameCountViewSet(viewsets.ViewSet, BaseViewThrottleSet):

    def list(self, request):
    
        bronze_event_hostnames = BronzeEventData.objects.values('hostname').distinct().count()
        router_data_hostnames = RouterData.objects.values('hostname').distinct().count()
        total_devices = bronze_event_hostnames + router_data_hostnames
        
        # Return the counts
        return Response({
            'total_devices': total_devices
        })