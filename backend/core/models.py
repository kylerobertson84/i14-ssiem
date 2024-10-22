from django.db import models
from utils.models import BaseModel
from utils.baseViewThrottle import BaseViewThrottleSet

class Rule(BaseModel, BaseViewThrottleSet):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    conditions = models.TextField()
    severity = models.CharField(max_length=20, choices=[
        ('INFO', 'Info'),
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical')
    ], default='MEDIUM')

    def __str__(self):
        return f"{self.name} - {self.severity}"