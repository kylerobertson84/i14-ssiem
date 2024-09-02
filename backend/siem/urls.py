"""
URL configuration for siem project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# siem/urls.py

from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from siem.views import health_check

from rest_framework.routers import DefaultRouter
from logs.views import BronzeEventDataViewSet, RouterDataViewSet, LogPercentageViewSet, LogPercentageViewSet, LogAggregationViewSet, EventsToday
from alerts.views import AlertViewSet, InvestigateAlertViewSet
from reports.views import IncidentReportViewSet

router = DefaultRouter()
router.register(r'bronze-events', BronzeEventDataViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'investigate', InvestigateAlertViewSet)
router.register(r'incident-reports', IncidentReportViewSet)
router.register(r'router-data', RouterDataViewSet)

router.register(r'log-percentage', LogPercentageViewSet, basename='log-percentage')
router.register(r'logs-aggregation', LogAggregationViewSet, basename='logs-aggregation')
router.register(r'events-today', EventsToday, basename='events-today')


urlpatterns = [
    # path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/health', health_check, name='health_check'),
    path('api/v1/', include(router.urls)),
    path('api/', include('accounts.urls')),
    # path('api/v1/logs/', include('logs.urls')),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    # API paths 
    #/api/v1/bronze-events/
    #/api/v1/events/
    #/api/v1/alerts/
    #/api/v1/investigate/
    #/api/v1/incident-reports/
    #/api/v1/incident-reports/{id}/generate_pdf/
    
    
    # TESTING APIs
    # /api/schema/redoc/
    # /api/schema/swagger-ui/
]