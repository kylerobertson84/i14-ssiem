
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
from django.utils import timezone

from logs.management.commands.regexs import *
import re




def insert_data(data):

    timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S.%f%z')
    event_received_time = datetime.strptime(data['event_received_time'], '%Y-%m-%d %H:%M:%S')
    if event_received_time:
            event_received_time = timezone.make_aware(event_received_time, timezone.get_current_timezone())

    BronzeEventData.objects.create(
            priority=int(data.get('priority', 0)),
            version=int(data.get('version', 0)),
            timestamp=timestamp,
            hostname=data.get('hostname', ''),
            app_name=data.get('app_name', ''),
            process_id=int(data.get('process_id', 0)),
            nxlog_keywords=data.get('nxlog_keywords', ''),
            event_type=data.get('event_type', ''),
            event_id=int(data.get('event_id', 0)),
            provider_guid=data.get('provider_guid', ''),
            task=data.get('task', ''),
            opcode_value=int(data.get('opcode_value', 0)),
            record_number=int(data.get('record_number', 0)),
            thread_id=int(data.get('thread_id', 0)),
            channel=data.get('channel', ''),
            opcode=data.get('opcode', ''),
            event_received_time=event_received_time,
            source_module_name=data.get('source_module_name', ''),
            source_module_type=data.get('source_module_type', ''),
            message=data.get('message', '')
        )

def parse_header_fields(header):
    

    split_pri_from_headers = re.split(r'(?<=\>)', header)
    pri_str = split_pri_from_headers[0]
    pri = pri_str.replace('<', '').replace('>', '')
    # print(pri)

    print(split_pri_from_headers[1])

    

def parse_body_fields(string):
    pass

def parse_line(line):

    try:
        # TODO

        """
        1. Place text line into header, body, message strings
        2. Parse the header into fields
        3. Parse the body into fields
        """
        

        # if " - " in line:
        if re.search(r'(?<!\S)-(?!\S)', line):

            split_header_from_body_message = line.split(" - ")

            split_body_from_message = re.split(r'(?<=\])', split_header_from_body_message[1])
            
            header_str = split_header_from_body_message[0]
            body_str = split_body_from_message[0]
            message_str = split_body_from_message[1]

            parse_header_fields(header_str)


            # print(header_str)
            # print(body_str)
            # print(message_str)
            # print(" ")

            

            # print(split_body_from_message[0])
            # print(" ")
            # print(message_str)

            # print(split_header_from_body_message[0])
            # print(split_header_from_body_message[1])
            
        
        



        
        # ms_hyper_match = MS_HYPER.match(line)
        # ms_match = MS_STORE.match(line)
        # ms_security_auditing_match = MS_SECURITY_AUDITING.match(line)
        # ms_push_notifications_match = MS_PUSH_NOTIFICATIONS.match(line)
        # ms_wmi_activity = MS_WMI_ACTIVITY.match(line)
        # general_match = LOG_PATTERN_GENERAL.match(line)


        # if ms_hyper_match:
        #     data = ms_hyper_match.groupdict()
        #     insert_data(data)

        # elif ms_match:
        #     data = ms_match.groupdict()
        #     insert_data(data)
        
        # elif ms_security_auditing_match:
        #     data = ms_security_auditing_match.groupdict()
        #     insert_data(data)

        # elif ms_push_notifications_match:
        #     data = ms_push_notifications_match.groupdict()
        #     insert_data(data)
        
        # elif ms_wmi_activity:
        #     data = ms_wmi_activity.groupdict()
        #     insert_data(data)

        # elif general_match:
        #     data = general_match.groupdict()
        #     insert_data(data)

        # else:
        #     print(f"Line did not match: {line.strip()}")
        #     exit()

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


    