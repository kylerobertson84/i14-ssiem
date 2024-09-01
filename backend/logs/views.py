from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import BronzeEventData, RouterData
from .serializers import BronzeEventDataSerializer, RouterDataSerializer, LogCountSerializer
from utils.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
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


