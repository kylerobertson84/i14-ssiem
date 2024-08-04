from django.contrib import admin
from .models import BronzeEventData, EventData

@admin.register(BronzeEventData)
class BronzeEventDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'event_time', 'hostname', 'event_type', 'severity', 'event_id')
    list_filter = ('severity', 'event_type')
    search_fields = ('hostname', 'event_id', 'account_name')

@admin.register(EventData)
class EventDataAdmin(admin.ModelAdmin):
    list_display = ('event_id', 'timestamp', 'source', 'rule')
    list_filter = ('rule',)
    search_fields = ('source__hostname', 'rule__rule_name')