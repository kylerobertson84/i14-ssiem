from django.db import models
from utils.models import BaseModel
from core.models import Rule
from django.conf import settings

class BronzeEventData(BaseModel):
    priority = models.IntegerField(null=True, blank=True)
    version = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)
    hostname = models.CharField(max_length=100, null=True, blank=True)
    app_name = models.CharField(max_length=100, null=True, blank=True)
    process_id = models.IntegerField(null=True, blank=True)
    nxlog_keywords = models.CharField(max_length=500, null=True, blank=True)
    event_type = models.CharField(max_length=50, null=True, blank=True)
    event_id = models.IntegerField(null=True, blank=True)
    provider_guid = models.CharField(max_length=100, null=True, blank=True)
    version = models.IntegerField(null=True, blank=True)
    task = models.CharField(max_length=100, null=True, blank=True)
    opcode_value = models.IntegerField(null=True, blank=True)
    record_number = models.IntegerField(null=True, blank=True)
    thread_id = models.IntegerField(null=True, blank=True)
    channel = models.CharField(max_length=100, null=True, blank=True)
    opcode = models.CharField(max_length=50, null=True, blank=True)
    operation_name = models.CharField(max_length=100, null=True, blank=True)
    operation_type = models.IntegerField(null=True, blank=True)
    operation_id = models.IntegerField(null=True, blank=True)
    execution_time_ms = models.IntegerField(null=True, blank=True)
    queued_time_ms = models.IntegerField(null=True, blank=True)
    sla_threshold_ms = models.IntegerField(null=True, blank=True)
    context_type1 = models.IntegerField(null=True, blank=True)
    context_info1 = models.CharField(max_length=100, null=True, blank=True)
    context_type2 = models.IntegerField(null=True, blank=True)
    context_info2 = models.CharField(max_length=100, null=True, blank=True)
    context_type3 = models.IntegerField(null=True, blank=True)
    context_info3 = models.CharField(max_length=100, null=True, blank=True)
    event_received_time = models.DateTimeField(null=True, blank=True)
    source_module_name = models.CharField(max_length=100, null=True, blank=True)
    source_module_type = models.CharField(max_length=100, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return f"LogEntry {self.event_id} - {self.event_time}"
    

class EventData(BaseModel):
    event_id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField()
    # source = models.ForeignKey(BronzeEventData, on_delete=models.CASCADE)
    # rule = models.ForeignKey(Rule, on_delete=models.CASCADE)

    def __str__(self):
        return f"Event {self.id} - {self.timestamp}"