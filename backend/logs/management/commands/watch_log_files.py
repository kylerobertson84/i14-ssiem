import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from django.core.management.base import BaseCommand
from django.core.management import call_command

class LogFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.txt'):
            print(f"New log file detected: {event.src_path}")
            # Extract the filename from the event's source path
            filename = os.path.basename(event.src_path)

            # Determine which command to call based on the filename
            if filename == 'log1.txt':
                call_command('parse_log_file', event.src_path)
            elif filename == 'router1.txt':
                call_command('parse_router', event.src_path)
            else:
                print(f"No command associated with the file: {filename}")


class Command(BaseCommand):
    help = 'Watch for new log files and process them'

    def add_arguments(self, parser):
        parser.add_argument('directory', type=str, help='Directory to watch for new log files')

    def handle(self, *args, **options):
        path = options['directory']
        event_handler = LogFileHandler()
        observer = Observer()
        observer.schedule(event_handler, path, recursive=False)
        observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()