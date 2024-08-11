from utils.baseViewThrottle import BaseViewThrottleSet

from .models import Rule
from .serializers import RuleSerializer

class RuleViewSet(BaseViewThrottleSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer