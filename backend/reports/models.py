from django.db import models
from utils.models import BaseModel
from accounts.models import User

class IncidentReport(BaseModel):
    type = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=[('ongoing', 'Ongoing'), ('closed', 'Closed')])
    source = models.ForeignKey('logs.BronzeEventData', on_delete=models.CASCADE)
    rules = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"Incident Report {self.id} - {self.type}"