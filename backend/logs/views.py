from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import BronzeEventData, EventData
from .serializers import BronzeEventDataSerializer, EventDataSerializer

class BronzeEventDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BronzeEventData.objects.all()
    serializer_class = BronzeEventDataSerializer
    permission_classes = [IsAuthenticated]

class EventDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventData.objects.all()
    serializer_class = EventDataSerializer
    permission_classes = [IsAuthenticated]