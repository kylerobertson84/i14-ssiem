from django.db import models
from utils.models import BaseModel

class BronzeEventData(BaseModel):
    event_time = models.CharField(max_length=255)
    hostname = models.CharField(max_length=255)
    keywords = models.CharField(max_length=255)
    event_type = models.CharField(max_length=255)
    severity_value = models.IntegerField()
    severity = models.CharField(max_length=255)
    event_id = models.IntegerField()
    source_name = models.CharField(max_length=255)
    provider_guid = models.CharField(max_length=255)
    version = models.IntegerField()
    task = models.IntegerField()
    opcode_value = models.IntegerField()
    record_number = models.IntegerField()
    process_id = models.IntegerField()
    thread_id = models.IntegerField()
    channel = models.CharField(max_length=255)
    domain = models.CharField(max_length=255)
    account_name = models.CharField(max_length=255)
    user_id = models.CharField(max_length=255)
    account_type = models.CharField(max_length=255)
    message = models.CharField(max_length=255)
    opcode = models.CharField(max_length=255)
    event_received_time = models.CharField(max_length=255)
    source_module_name = models.CharField(max_length=255)
    source_module_type = models.CharField(max_length=255)

    def __str__(self):
        return f"Event {self.event_id} - {self.event_time}"

class EventData(BaseModel):
    timestamp = models.DateTimeField()
    source = models.ForeignKey(BronzeEventData, on_delete=models.CASCADE)
    rule = models.ForeignKey('alerts.Rule', on_delete=models.CASCADE)

    def __str__(self):
        return f"Event {self.id} - {self.timestamp}"