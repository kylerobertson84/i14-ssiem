import logging
from celery import shared_task
from logs.models import BronzeEventData, EventData
from alerts.models import Alert
from utils.rule_engine import RuleEngine
from django.utils import timezone

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def process_logs(self):
    rule_engine = RuleEngine()
    unprocessed_logs = BronzeEventData.objects.filter(processed=False)

    logger.info(f"Found {unprocessed_logs.count()} unprocessed logs.")

    for log in unprocessed_logs:
        logger.info(f"Processing log ID: {log.id}")
        try:
            matched_rules = rule_engine.match_rule(log)

            for rule in matched_rules:
                logger.info(f"  Matched rule: {rule.rule_name}")
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
        except Exception as e:
            logger.error(f"Error processing log ID: {log.id} - {str(e)}")
            self.retry(exc=e)

    logger.info(f"Processed {unprocessed_logs.count()} logs.")