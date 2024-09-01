from django.core.management.base import BaseCommand
from django.db import connection
from core.models import Rule
import json

class Command(BaseCommand):
    help = 'Creating Rules for the SIEM system'

    def handle(self, *args, **kwargs):
        # Check if the Rule table exists
        if not self.table_exists('core_rule'):
            self.stdout.write(self.style.ERROR("The Rule table does not exist. Please run migrations first."))
            return

        rules = [
            {
                "name": "Multiple Failed Logins",
                "description": "Detects multiple failed login attempts from the same source",
                "conditions": json.dumps({
                    "EventID": 4625,
                    "frequency": {
                        "count": 5,
                        "timeframe": "5m"
                    },
                    "Channel": "Security"
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