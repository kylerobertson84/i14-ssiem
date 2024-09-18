from django.core.management.base import BaseCommand
from core.models import Rule
from reports.models import IncidentReport
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Preloads data into the IncidentReport table'

    def handle(self, *args, **kwargs):
    
        reports = [
            {
                "title": "Unauthorized Access Attempt",
                "type": IncidentReport.ReportType.SECURITY_INCIDENT,
                "status": IncidentReport.ReportStatus.OPEN,
                "description": "Multiple failed login attempts detected from a single IP address.",
                "user_id": 1,  
                "rules": [1, 2]
            },
            {
                "title": "Network Traffic Anomaly",
                "type": IncidentReport.ReportType.NETWORK_TRAFFIC,
                "status": IncidentReport.ReportStatus.PENDING,
                "description": "Unusual network traffic patterns detected.",
                "user_id": 1, 
                "rules": [3, 4] 
            },
            # Add more reports as needed
        ]

        # Iterate and create reports
        for report_data in reports:
            rules = Rule.objects.filter(id__in=report_data.pop("rules"))
            IncidentReport.objects.create(
                title=report_data["title"],
                type=report_data["type"],
                status=report_data["status"],
                description=report_data["description"],
                user_id=report_data["user_id"],
                created_at=timezone.now(), 
                updated_at=timezone.now()   
            ).rules.set(rules)
            self.stdout.write(self.style.SUCCESS(f"Created incident report: {report_data['title']}"))
