from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BronzeEventDataViewSet, RouterDataViewSet, LogPercentageViewSet, LogAggregationViewSet, EventsToday

router = DefaultRouter()
router.register(r'bronze-events', BronzeEventDataViewSet)
router.register(r'router-data', RouterDataViewSet)
router.register(r'log-percentage', LogPercentageViewSet, basename='log-percentage')
router.register(r'logs-aggregation', LogAggregationViewSet, basename='logs-aggregation')

# router.register(r'events', EventDataViewSet)
router.register(r'events-today', EventsToday, basename='events-today')

urlpatterns = [
    path('', include(router.urls)),
]