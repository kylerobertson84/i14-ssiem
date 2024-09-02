
# logs/models.py

from django.db import models
from utils.models import BaseModel

class BronzeEventData(BaseModel):
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.IntegerField(null=True, blank=True)
    h_version = models.IntegerField(null=True, blank=True)
    ## Better algo dont need this field
    #processed = models.BooleanField(default=False)
    iso_timestamp = models.DateTimeField(null=True, blank=True)
    hostname = models.CharField(max_length=255,null=True, blank=True)
    app_name = models.CharField(max_length=255,null=True, blank=True)
    process_id = models.CharField(max_length=50,null=True, blank=True)
    Keywords = models.CharField(max_length=50,null=True, blank=True)
    EventType = models.CharField(max_length=50,null=True, blank=True)
    EventID = models.CharField(max_length=50,null=True, blank=True)
    ProviderGuid = models.CharField(max_length=255,null=True, blank=True)
    Version = models.CharField(max_length=10,null=True, blank=True)
    Task = models.CharField(max_length=10,null=True, blank=True)
    OpcodeValue = models.CharField(max_length=10,null=True, blank=True)
    RecordNumber = models.CharField(max_length=50,null=True, blank=True)
    ActivityID = models.CharField(max_length=255,null=True, blank=True)
    ThreadID = models.CharField(max_length=50,null=True, blank=True)
    Channel = models.CharField(max_length=255,null=True, blank=True)
    Domain = models.CharField(max_length=255,null=True, blank=True)
    AccountName = models.CharField(max_length=255,null=True, blank=True)
    UserID = models.CharField(max_length=50,null=True, blank=True)
    AccountType = models.CharField(max_length=50,null=True, blank=True)
    Opcode = models.CharField(max_length=100,null=True, blank=True)
    PackageName = models.CharField(max_length=255,null=True, blank=True)
    ContainerId = models.CharField(max_length=255,null=True, blank=True)
    EventReceivedTime = models.DateTimeField(null=True, blank=True)
    SourceModuleName = models.CharField(max_length=50,null=True, blank=True)
    SourceModuleType = models.CharField(max_length=50,null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    extra_fields = models.TextField(null=True, blank=True)
    #processed = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.iso_timestamp} - {self.app_name} - {self.EventType}"
    
## Duplicate why do we even need this one? Doesn't make sense
## We can just use the BronzeEventData model
## and add a field to indicate if the data has been processed
# class EventData(BaseModel):
#     event_id = models.AutoField(primary_key=True)
#     timestamp = models.DateTimeField()
#     # source = models.ForeignKey(BronzeEventData, on_delete=models.CASCADE)
#     # rule = models.ForeignKey(Rule, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"Event {self.id} - {self.timestamp}"

class RouterData(BaseModel):
    created_at = models.DateTimeField(auto_now_add=True)
    severity = models.IntegerField(null = True, blank = True)
    date_time = models.CharField(max_length=100,null=True,blank=True)
    hostname = models.CharField(max_length=100,null=True,blank=True)
    process = models.CharField(max_length=100,null=True,blank=True)
    message = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.date_time} - {self.hostname} - {self.process}"


