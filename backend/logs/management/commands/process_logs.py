from django.core.management.base import BaseCommand
from logs.models import BronzeEventData, EventData
from alerts.models import Alert, AlertSeverity
from utils.rule_engine import RuleEngine
from django.utils import timezone

class Command(BaseCommand):
    help = 'Processes unprocessed logs and applies rules'

    def handle(self, *args, **options):
        rule_engine = RuleEngine()
        unprocessed_logs = BronzeEventData.objects.filter(processed=False)

        self.stdout.write(f"Found {unprocessed_logs.count()} unprocessed logs.")

        for log in unprocessed_logs:
            self.stdout.write(f"Processing log ID: {log.id}")
            matched_rules = rule_engine.match_rule(log)

            for rule in matched_rules:
                self.stdout.write(f"  Matched rule: {rule.rule_name}")
                event_data = EventData.objects.create(
                    timestamp=timezone.now(),
                )

                Alert.objects.create(
                    timestamp=timezone.now(),
                    event=event_data,
                    severity=rule.severity,
                    rule=rule
                )

            log.processed = True
            log.save()

        self.stdout.write(self.style.SUCCESS(f"Processed {unprocessed_logs.count()} logs."))