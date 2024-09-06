from django.db import models
from utils.models import BaseModel
from core.models import Rule
from logs.models import BronzeEventData
from django.conf import settings

class AlertSeverity(models.TextChoices):
    INFO = 'INFO', 'Info'
    LOW = 'LOW', 'Low'
    MEDIUM = 'MEDIUM', 'Medium'
    HIGH = 'HIGH', 'High'
    CRITICAL = 'CRITICAL', 'Critical'
    
class InvestigationStatus(models.TextChoices):
    OPEN = 'OPEN', 'Open'
    IN_PROGRESS = 'IN PROGRESS', 'In Progress'
    CLOSED = 'CLOSED', 'Closed'

class Alert(BaseModel):
    id = models.AutoField(primary_key=True)
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE, default=None)
    event = models.ForeignKey(BronzeEventData, on_delete=models.CASCADE, default=None)
    severity = models.CharField(
        max_length=20,
        choices=AlertSeverity.choices,
        default=AlertSeverity.INFO
    )
    comments = models.TextField(null=True, blank=True)


    def __str__(self):
        return f"Alert {self.id} at {self.created_at} with {self.severity}. Triggered by {self.event} with rule {self.rule.name}. Created on {self.created_at} - Last updated on {self.updated_at}"
        
    class Meta:
        ordering = ['-created_at']

## InvestigateAlert model - AssignedAlert
class InvestigateAlert(BaseModel):
    id = models.AutoField(primary_key=True)
    alert = models.OneToOneField(Alert, on_delete=models.CASCADE, related_name='investigation')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=InvestigationStatus.choices,
        default=InvestigationStatus.OPEN
    )
    notes = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return f"Alert {self.alert} assigned to {self.assigned_to} at {self.created_at} with status {self.status}. Investigation ID: {self.id}, created on {self.created_at} - Last updated on {self.updated_at}"