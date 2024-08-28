from django.contrib import admin
from .models import Rule

@admin.register(Rule)
class RuleAdmin(admin.ModelAdmin):
    list_display = ('rule_id', 'rule_name', 'description')
    search_fields = ('rule_name', 'description')
    list_filter = ('rule_name',)