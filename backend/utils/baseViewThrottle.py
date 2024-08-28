from rest_framework import viewsets
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BaseViewThrottleSet(viewsets.ModelViewSet):
    throttle_classes = [UserRateThrottle, AnonRateThrottle]