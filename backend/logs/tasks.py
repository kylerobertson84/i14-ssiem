import logging
import os
import shutil
from celery import shared_task
from logs.models import BronzeEventData, EventData
from alerts.models import Alert
from utils.rule_engine import RuleEngine
from django.utils import timezone
from django.core.management import call_command
from django.conf import settings

logger = logging.getLogger(__name__)

# # Define a mapping of file patterns to processing commands
# FILE_PROCESSING_MAP = {
#     'log1.txt': 'parse_log_file',
#     'router1.txt': 'parse_router',
#     # Add more patterns and commands as needed
# }

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
    finally:
        process_logs()

def process_log_file(log_directory, processed_directory, filename):
    file_path = os.path.join(log_directory, filename)
    try:
        ## Hardcoded to check if the file is log1.txt or router1.txt
        if filename == 'log1.txt':
            call_command('parse_log_file', file_path)
            logger.info(f"Processed log file: {filename}")
        elif filename == 'router1.txt':
            call_command('parse_router', file_path)
            logger.info(f"Processed router file: {filename}")
        else:
            logger.warning(f"No command associated with the file: {filename}")
            
        # Dynamic way to process files
        # command = FILE_PROCESSING_MAP.get(filename)
        # if command:
        #     call_command(command, file_path)
        #     logger.info(f"Processed file {filename} with command {command}")
        # else:
        #     logger.warning(f"No command associated with the file: {filename}")
        
        # Move the processed file to the processed directory
        shutil.move(file_path, os.path.join(processed_directory, filename))
        logger.info(f"Moved file {filename} to {processed_directory}")
    except Exception as e:
        logger.error(f"Error processing file {filename}: {e}")


@shared_task(bind=True, max_retries=3)
def process_logs(self):
    rule_engine = RuleEngine()
    unprocessed_logs = BronzeEventData.objects.filter(processed=False)

    logger.info(f"Found {unprocessed_logs.count()} unprocessed logs.")

    for log in unprocessed_logs:
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