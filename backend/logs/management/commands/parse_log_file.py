
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime

LOG_PATTERN = re.compile(
    r'^<(?P<priority>\d+)>'
)

def parse_line(line):
    match = LOG_PATTERN.match(line)

    if match:
        data = match.groupdict()

        # timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S.%f%z')

        BronzeEventData.objects.create(
            priority=int(data['priority']),
            # timestamp=timestamp,
        )

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('logfile', type=str, help='The path to the log file')

    def handle(self, *args, **kwargs):
        logfile = kwargs['logfile']
        try:
            with open(logfile, 'r') as file:
                for line in file:
                    parse_line(line)
            self.stdout.write(self.style.SUCCESS('Successfully parsed the log file'))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {logfile}'))


    