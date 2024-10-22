from django.db import models
from utils.models import BaseModel
from utils.baseViewThrottle import BaseViewThrottleSet
from core.models import Rule
from django.conf import settings

class IncidentReport(BaseModel, BaseViewThrottleSet):
    class ReportType(models.TextChoices):
        SECURITY_INCIDENT = 'security_incident', ('Security Incident')
        NETWORK_TRAFFIC = 'network_traffic', ('Network Traffic')
        USER_ACTIVITY = 'user_activity', ('User Activity')
        SYSTEM_PERFORMANCE = 'system_performance', ('System Performance')
        COMPLIANCE_AUDIT = 'compliance_audit', ('Compliance Audit')

    class ReportStatus(models.TextChoices):
        DRAFT = 'draft', ('Draft')
        OPEN = 'open', ('Open')
        PENDING = 'pending', ('Pending')
        APPROVED = 'approved', ('Approved')
        REJECTED = 'rejected', ('Rejected')
        ARCHIVED = 'archived',('Archived')
    title = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=20, choices=ReportType.choices)
    status = models.CharField(max_length=10, choices=ReportStatus.choices, default=ReportStatus.OPEN)
    # source = models.ForeignKey('logs.BronzeEventData', on_delete=models.CASCADE)
    rules = models.ManyToManyField(Rule, related_name='incident_reports', blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.TextField()
    pdf_file = models.FileField(upload_to='incident_reports/', null=True, blank=True)

    def __str__(self):
        return f"Incident Report {self.id} - {self.type}"

    class Meta:
        ordering = ['-created_at']