from rest_framework import viewsets
from .models import Rule
from .serializers import RuleSerializer

class RuleViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer