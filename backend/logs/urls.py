from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BronzeEventDataViewSet, EventDataViewSet

router = DefaultRouter()
router.register(r'bronze-events', BronzeEventDataViewSet)
router.register(r'events', EventDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]