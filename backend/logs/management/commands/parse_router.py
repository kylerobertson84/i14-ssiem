
from django.core.management.base import BaseCommand
from logs.models import *
import re

# def parse_fields():

#     field_dict = dict()

    


def parse_line(line):

    try:

        split_sev_from_header = re.split(r'(?<=\>)', line)
        sev_str = split_sev_from_header[0]
        severity = sev_str.replace('<', '').replace('>', '')

        print(severity[0])

        


    except Exception as e:
        print(f"Error processing line: {line}\nError: {e}")


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
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error processing log file: {e}'))
