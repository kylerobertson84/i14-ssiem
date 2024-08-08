from django.db import models
from utils.models import BaseModel
from core.models import Rule
from django.conf import settings

class BronzeEventData(BaseModel):
    priority = models.IntegerField()
    version = models.IntegerField()
    event_time = models.DateTimeField()
    hostname = models.CharField(max_length=255, null=True)
    app_name = models.CharField(max_length=255, null=True)
    proc_id = models.CharField(max_length=255, null=True)
    message_id = models.CharField(max_length=255, null=True)
    keywords = models.CharField(max_length=255, null=True)
    event_type = models.CharField(max_length=50, null=True)
    event_id = models.CharField(max_length=50, null=True)
    provider_guid = models.CharField(max_length=50, null=True)
    version_info = models.CharField(max_length=10, null=True)
    task = models.CharField(max_length=10, null=True)
    opcode_value = models.CharField(max_length=10, null=True)
    record_number = models.CharField(max_length=50, null=True)
    thread_id = models.CharField(max_length=50, null=True)
    channel = models.CharField(max_length=255, null=True)
    domain = models.CharField(max_length=255, null=True)
    account_name = models.CharField(max_length=255, null=True)
    user_id = models.CharField(max_length=50, null=True)
    account_type = models.CharField(max_length=50, null=True)
    category = models.CharField(max_length=255, null=True)
    opcode = models.CharField(max_length=50, null=True)
    function = models.CharField(max_length=255, null=True)
    source = models.CharField(max_length=255, null=True)
    line_number = models.CharField(max_length=50, null=True)
    event_received_time = models.DateTimeField()
    source_module_name = models.CharField(max_length=255)
    source_module_type = models.CharField(max_length=255)
    message = models.TextField()

    def __str__(self):
        return f"LogEntry {self.event_id} - {self.event_time}"

class EventData(BaseModel):
    event_id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField()
    source = models.ForeignKey(BronzeEventData, on_delete=models.CASCADE)
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE)

    def __str__(self):
        return f"Event {self.id} - {self.timestamp}"