from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet, InvestigateAlertViewSet
from .views import LatestAlertView



router = DefaultRouter()
router.register(r'alerts', AlertViewSet)
router.register(r'investigate', InvestigateAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('alerts/get-latest-alert/', LatestAlertView.as_view(), name='get_latest_alert'),
]
