from django.core.management.base import BaseCommand
from core.models import Rule
import json

class Command(BaseCommand):
    help = 'Creating Rules for the SIEM system'

    def handle(self, *args, **kwargs):
        rules = [
            {
                "rule_name": "Multiple Failed Logins",
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
                "rule_name": "After-hours Login",
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
                "rule_name": "Account Lockout",
                "description": "Detects when an account is locked out",
                "conditions": json.dumps({
                    "EventID": [4740, 4767],
                    "Channel": "Security"
                }),
                "severity": "HIGH"
            },
            {
                "rule_name": "New User Account Created",
                "description": "Detects when a new user account is created",
                "conditions": json.dumps({
                    "EventID": 4720,
                    "Channel": "Security"
                }),
                "severity": "MEDIUM"
            },
            {
                "rule_name": "Scheduled Task Modified",
                "description": "Detects when a scheduled task is created, modified, enabled, or disabled",
                "conditions": json.dumps({
                    "EventID": [4698, 4699, 4700, 4702],
                    "Channel": "Security"
                }),
                "severity": "MEDIUM"
            },
            {
                "rule_name": "PowerShell Execution",
                "description": "Detects when PowerShell is executed",
                "conditions": json.dumps({
                    "EventID": [4103, 4104],
                    "Channel": "Windows PowerShell",
                }),
                "severity": "LOW"
            },
            {
                "rule_name": "Explicit Credential Usage",
                "description": "Detects when a user logs on using explicit credentials while already logged in",
                "conditions": json.dumps({
                    "EventID": 4648,
                    "Channel": "Security"
                }),
                "severity": "HIGH"
            },
            {
                "rule_name": "Malware Dection",
                "description": "Detects Windows Defender malware-related events",
                "conditions": json.dumps({
                    "EventID": [1005, 1006, 1007, 1008],
                    "Channel": "Microsoft-Windows-Windows Defender/Operational",
                }),
                "severity": "CRITICAL"
            },
            {
                "rule_name": "Sensitive Group Modified",
                "description": "Detects when a sensitive group (e.g., Administrators) is modified",
                "conditions": json.dumps({
                    "EventID": [4728, 4729, 4732, 4756],
                    "Channel": "Security",
                    "TargetUserName": ["Administrators", "Domain Admins", "Enterprise Admins"] 
                }),
                "severity": "HIGH"
            },
            {
                "rule_name": "Remote Desktop Connection",
                "description": "Detects when a remote desktop connection is established",
                "conditions": json.dumps({
                    "EventID": 4624,
                    "Channel": "Security",
                    "LogonType": 10
                }),
                "severity": "MEDIUM"
            }
            
        ]

        for rule_data in rules:
            Rule.objects.create(**rule_data)
            self.stdout.write(self.style.SUCCESS(f"Created rule: {rule_data['rule_name']}"))