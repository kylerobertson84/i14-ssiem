from django.contrib import admin
from .models import IncidentReport

@admin.register(IncidentReport)
class IncidentReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'status', 'source', 'user')
    list_filter = ('type', 'status', 'user')
    search_fields = ('user__username', 'source__hostname', 'description')