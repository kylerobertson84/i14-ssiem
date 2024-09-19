from django.core.management.base import BaseCommand
from django.db import connection
from core.models import Rule
from accounts.models import User
from reports.models import IncidentReport

import json
import random

class Command(BaseCommand):
    help = 'Creating Rules for the SIEM system'

    def handle(self, *args, **kwargs):
        if not self.table_exists('core_rule'):
            self.stdout.write(self.style.ERROR("The Rule table does not exist. Please run migrations first."))
            return

        if not self.table_exists('reports_incidentreport'):
            self.stdout.write(self.style.ERROR("The IncidentReport table does not exist. Please run migrations first."))
            return

        self.create_rules()
        self.create_sample_reports()

    def create_rules(self):
        rules = [
            {
                "name": "Multiple Failed Logins",
                "description": "Detects multiple failed login attempts within a short timeframe in either Application or Security channels",
                "conditions": json.dumps({
                    "EventID": "4625",
                    "frequency": {
                        "count": 5,
                        "timeframe": "5m"
                    },
                    "Channel": ["Application", "Security"]
                }),
                "severity": "HIGH"
            },
            {
                "name": "After-hours Login",
                "description": "Detects successful logins outside of normal business hours",
                "conditions": json.dumps({
                    "EventID": 4624,
                    "time_range": {
                        "start": "18:00",
                        "end": "06:00"
                    }
                }),
                "severity": "MEDIUM"
            },
            {
                "name": "Account Lockout",
                "description": "Detects when an account is locked out",
                "conditions": json.dumps({
                    "EventID": [4740, 4767],
                    "Channel": "Security"
                }),
                "severity": "HIGH"
            },
            {
                "name": "New User Account Created",
                "description": "Detects when a new user account is created",
                "conditions": json.dumps({
                    "EventID": 4720,
                    "Channel": "Security"
                }),
                "severity": "MEDIUM"
            },
            {
                "name": "Scheduled Task Modified",
                "description": "Detects when a scheduled task is created, modified, enabled, or disabled",
                "conditions": json.dumps({
                    "EventID": [4698, 4699, 4700, 4702],
                    "Channel": "Security"
                }),
                "severity": "MEDIUM"
            },
            {
                "name": "PowerShell Execution",
                "description": "Detects when PowerShell is executed",
                "conditions": json.dumps({
                    "EventID": [4103, 4104],
                    "Channel": "Windows PowerShell",
                }),
                "severity": "LOW"
            },
            {
                "name": "Explicit Credential Usage",
                "description": "Detects when a user logs on using explicit credentials while already logged in",
                "conditions": json.dumps({
                    "EventID": 4648,
                    "Channel": "Security"
                }),
                "severity": "HIGH"
            },
            {
                "name": "Malware Dection",
                "description": "Detects Windows Defender malware-related events",
                "conditions": json.dumps({
                    "EventID": [1005, 1006, 1007, 1008],
                    "Channel": "Microsoft-Windows-Windows Defender/Operational",
                }),
                "severity": "CRITICAL"
            },
            {
                "name": "Sensitive Group Modified",
                "description": "Detects when a sensitive group (e.g., Administrators) is modified",
                "conditions": json.dumps({
                    "EventID": [4728, 4729, 4732, 4756],
                    "Channel": "Security",
                    "TargetUserName": ["Administrators", "Domain Admins", "Enterprise Admins"] 
                }),
                "severity": "HIGH"
            },
            {
                "name": "Remote Desktop Connection",
                "description": "Detects when a remote desktop connection is established",
                "conditions": json.dumps({
                    "EventID": 4624,
                    "Channel": "Security",
                    "LogonType": 10
                }),
                "severity": "MEDIUM"
            },
            {
                "name": "System Boot",
                "description": "Logs when the system is started",
                "conditions": json.dumps({
                    "EventID": 6005,
                    "Channel": "System"
                }),
                "severity": "INFO"
            },
            {
                "name": "System Shutdown",
                "description": "Logs when the system is shut down",
                "conditions": json.dumps({
                    "EventID": 6006,
                    "Channel": "System"
                }),
                "severity": "INFO"
            },
            {
                "name": "Service Started",
                "description": "Detects when a service is started",
                "conditions": json.dumps({
                    "EventID": 7001,
                    "Channel": "System"
                }),
                "severity": "INFO"
            },
            {
                "name": "Service Stopped",
                "description": "Detects when a service is stopped",
                "conditions": json.dumps({
                    "EventID": 7009,
                    "Channel": "System"
                }),
                "severity": "INFO"
            },
        ]

        for rule_data in rules:
            Rule.objects.create(**rule_data)
            self.stdout.write(self.style.SUCCESS(f"Created rule: {rule_data['name']}"))

    def table_exists(self, table_name):
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '{table_name}'")
            return cursor.fetchone()[0] == 1
        
    def create_sample_reports(self):
        # Ensure we have a user
        user, created = User.objects.get_or_create(
            email="admin@example.com",
            defaults={'is_staff': True, 'is_superuser': True}
        )
        if created:
            user.set_password('admin')
            user.save()

        # Get all rules
        rules = list(Rule.objects.all())

        # Create sample reports
        report_types = IncidentReport.ReportType.choices
        report_statuses = IncidentReport.ReportStatus.choices

        for i in range(20):  # Create 10 sample reports
            report = IncidentReport.objects.create(
                title=f"Sample Incident Report {i+1}",
                type=random.choice(report_types)[0],
                status=random.choice(report_statuses)[0],
                user=user,
                description=f"This is a sample incident report description for report {i+1}.",
            )
            # Assign 1-3 random rules to each report
            report.rules.set(random.sample(rules, random.randint(1, 4)))
            self.stdout.write(self.style.SUCCESS(f"Created sample report: {report.title}"))

    def table_exists(self, table_name):
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '{table_name}'")
            return cursor.fetchone()[0] == 1