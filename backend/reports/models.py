from django.db import models
from utils.models import BaseModel
from core.models import Rule
from django.conf import settings

class IncidentReport(BaseModel):
    TYPE_CHOICES = [
        ('security_incident', 'Security Incident'),
        ('network_traffic', 'Network Traffic'),
        ('user_activity', 'User Activity'),
        ('system_performance', 'System Performance'),
        ('compliance_audit', 'Compliance Audit'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('ongoing', 'Ongoing'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    source = models.ForeignKey('logs.BronzeEventData', on_delete=models.CASCADE)
    rules = models.ManyToManyField(Rule, related_name='incident_reports', blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.TextField()
    pdf_file = models.FileField(upload_to='incident_reports/', null=True, blank=True)

    def __str__(self):
        return f"Incident Report {self.id} - {self.type}"

    class Meta:
        ordering = ['-created_at']