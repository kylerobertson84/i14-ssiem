import logging
import os
import shutil
from celery import shared_task
from logs.models import BronzeEventData
from alerts.models import Alert
from utils.rule_engine import RuleEngine
from django.utils import timezone
from django.core.management import call_command
from django.conf import settings
import traceback

logger = logging.getLogger(__name__)

@shared_task
def check_and_process_logs():
    log_directory = settings.LOG_FILES_DIRECTORY
    processed_directory = settings.PROCESSED_FILES_DIRECTORY
    try:
        for filename in os.listdir(log_directory):
            if filename.endswith('.txt'):
                process_log_file(log_directory, processed_directory, filename)
    except Exception as e:
        logger.error(f"Error processing logs: {e}")
        logger.error(traceback.format_exc())
    finally:
        process_logs()

def process_log_file(log_directory, processed_directory, filename):
    file_path = os.path.join(log_directory, filename)
    try:
        # Check if the file is router1.txt
        if filename == 'router1.txt':
            logger.info(f"Attempting to process router file: {filename}")
            call_command('parse_router', file_path)
            logger.info(f"Processed router file: {filename}")
        else:
            # Handle all other .txt files with parse_log_file
            logger.info(f"Attempting to process log file: {filename}")
            call_command('parse_log_file', file_path)
            logger.info(f"Processed log file: {filename}")

        # Move the processed file to the processed directory
        shutil.move(file_path, os.path.join(processed_directory, filename))
        logger.info(f"Moved file {filename} to {processed_directory}")
    except Exception as e:
        logger.error(f"Error processing file {filename}: {e}")
        logger.error(traceback.format_exc())

@shared_task(bind=True, max_retries=3)
def process_logs(self):
    rule_engine = RuleEngine()
    log_entries = BronzeEventData.objects.all()
    logger.info(f"Found {log_entries.count()} unprocessed logs.")
    
    for log in log_entries:
        try:
            matched_rules = rule_engine.match_rule(log)
            for rule in matched_rules:
                logger.info(f"Matched rule: {rule.name}")
                Alert.objects.create(
                    rule_id=rule,
                    event_id=BronzeEventData.objects.get(id=log.id),
                    severity=rule.severity,
                )
            log.save()
        except Exception as e:
            logger.error(f"Error processing log ID: {log.id} - {str(e)}")
            logger.error(traceback.format_exc())
            self.retry(exc=e)

    logger.info(f"Processed {log_entries.count()} logs.")