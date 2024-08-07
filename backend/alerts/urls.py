from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RuleViewSet, AlertViewSet, AssignedAlertViewSet

router = DefaultRouter()
router.register(r'rules', RuleViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'assigned-alerts', AssignedAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]