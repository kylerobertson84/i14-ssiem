from django.db import models
from utils.models import BaseModel
from core.models import Rule
from django.conf import settings



class BronzeEventData(BaseModel):
    Pri = models.CharField(max_length=255)
    Version = models.IntegerField()
    ISOTimeStamp = models.DateTimeField()
    Hostname = models.CharField(max_length=255)
    Application = models.CharField(max_length=255)
    PID = models.IntegerField()
    MessageId = models.CharField(max_length=255)
    Keywords = models.CharField(max_length=255)
    EventType = models.CharField(max_length=255)
    EventId = models.IntegerField()
    ProviderGuID = models.CharField(max_length=255)
    Version = models.IntegerField()
    Task = models.IntegerField()
    OpCodeValue = models.IntegerField()
    RecordNumber = models.IntegerField()
    ThreadId = models.IntegerField()
    Channel = models.CharField(max_length=255)
    Domain = models.CharField(max_length=255)
    AccountName = models.CharField(max_length=255)
    UserId = models.CharField(max_length=255)
    AccountType = models.CharField(max_length=255)
    RuleId = models.CharField(max_length=255)
    RuleName = models.CharField(max_length=255)
    Origin = models.IntegerField()
    ApplicationPath = models.CharField(max_length=255)
    Direction = models.IntegerField()
    Protocol = models.IntegerField()
    LocalPorts = models.CharField(max_length=255)
    RemotePorts = models.CharField(max_length=255)
    Action = models.IntegerField()
    Profiles = models.IntegerField()
    LocalAddresses = models.CharField(max_length=255)
    RemoteAddressess = models.CharField(max_length=255)
    Flags = models.IntegerField()
    Active = models.IntegerField()
    EdgeTraversal = models.IntegerField()
    LooseSourceMapped = models.IntegerField()
    SecurityOptions = models.IntegerField()
    ModifyingUser = models.CharField(max_length=255)
    SchemaVersion = models.IntegerField()
    RuleStatus = models.IntegerField()
    LocalOnlyMapped = models.IntegerField()
    ErrorCode = models.IntegerField()
    EventReceivedTime = models.DateTimeField()
    SourceModuleName = models.CharField(max_length=255)
    SourceModuleType = models.CharField(max_length=255)
    Message = models.TextField()


    def __str__(self):
        return f"Event {self.EventId} - {self.EventReceivedTime}"


class EventData(BaseModel):
    event_id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField()
    source = models.ForeignKey(BronzeEventData, on_delete=models.CASCADE)
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE)

    def __str__(self):
        return f"Event {self.id} - {self.timestamp}"