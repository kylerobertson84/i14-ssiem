from django.db import models
from utils.models import BaseModel

class Rule(BaseModel):
    rule_id = models.AutoField(primary_key=True)
    rule_name = models.CharField(max_length=30)
    description = models.CharField(max_length=255)
    conditions = models.TextField()

    def __str__(self):
        return self.rule_name