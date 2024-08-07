from django.db import models
from utils.models import BaseModel
from core.models import Rule
from django.conf import settings

class AlertSeverity(models.TextChoices):
    LOW = 'LOW', 'Low'
    MEDIUM = 'MEDIUM', 'Medium'
    HIGH = 'HIGH', 'High'
    CRITICAL = 'CRITICAL', 'Critical'

class AlertStatus(models.TextChoices):
    NEW = 'NEW', 'New'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    RESOLVED = 'RESOLVED', 'Resolved'
    CLOSED = 'CLOSED', 'Closed'

class Alert(BaseModel):
    alert_id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField()
    event = models.ForeignKey('logs.EventData', on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=AlertStatus.choices,
        default=AlertStatus.NEW
    )
    severity = models.CharField(
        max_length=20,
        choices=AlertSeverity.choices,
        default=AlertSeverity.MEDIUM
    )
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE)

    def __str__(self):
        return f"Alert {self.alert_id} - {self.timestamp} - {self.severity}"

class AssignedAlert(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE)

    def __str__(self):
        return f"Alert {self.alert.alert_id} assigned to {self.user.username}"