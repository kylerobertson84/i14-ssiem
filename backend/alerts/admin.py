from django.contrib import admin
from .models import Alert, AssignedAlert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('alert_id', 'timestamp', 'event', 'status', 'severity', 'rule')
    list_filter = ('status', 'severity', 'rule')
    search_fields = ('event__source__hostname', 'rule__rule_name')

@admin.register(AssignedAlert)
class AssignedAlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'alert')
    list_filter = ('user', 'alert__status', 'alert__severity')
    search_fields = ('user__username', 'alert__event__source__hostname')