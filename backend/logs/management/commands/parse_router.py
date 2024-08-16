
from django.core.management.base import BaseCommand
from logs.models import *
import re



# constant regular expressions

SEVERITY_RE = r'(?<=\>)'
DATE_TIME_RE = r'(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})'



def parse_line(line):

    try:

        # to get the severity / priority

        split_sev_from_header = re.split(SEVERITY_RE, line)
        sev_str = split_sev_from_header[0]
        severity = sev_str.replace('<', '').replace('>', '')

        # print(severity[0])
        # print(split_sev_from_header[1])
        
        # to get the date and time

        split_date_from_header = re.split(DATE_TIME_RE, split_sev_from_header[1])
        date_time = split_date_from_header[1]
        # print(date_time)

        # to get host name

        strip_str = split_date_from_header[2].strip()
        split_host_from_header = strip_str.split()
        host_name = split_host_from_header[0]
        # print(host_name)

        # to get process

        check_process = split_host_from_header[1]
        # print(check_process)

        # check if process contains a comma:

        if "," in check_process:
            remove_comma = check_process.replace(",", " ", 1)
            split_process_from_msg = remove_comma.split()
            process = split_process_from_msg[0]
        else:
            process = check_process.replace(":","")
           
        
        print(process)


        


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
