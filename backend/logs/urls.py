from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BronzeEventDataViewSet, RouterDataViewSet, LogPercentageViewSet

router = DefaultRouter()
router.register(r'bronze-events', BronzeEventDataViewSet)
# router.register(r'events', EventDataViewSet)
router.register(r'router-data', RouterDataViewSet)


urlpatterns = [
    path('', include(router.urls)),
]