
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
from django.utils import timezone

from logs.management.commands.regexs import *
import re

DICT_KEY_LIST_BODY = [
# body
    # 'message_id', ?? not found in log files
    'Keywords',
    'EventType',
    'EventID',
    'ProviderGuid',
    'Version',
    'Task',
    'OpcodeValue',
    'RecordNumber',
    'ActivityID',
    'ThreadID',
    'Channel',
    'Domain',
    'AccountName',
    'UserID',
    'AccountType',
    'Opcode',
    'PackageName',
    'ContainerId',
    'EventReceivedTime',
    'SourceModuleName',
    'SourceModuleType',
    'Keywords',
    'EventType',
    'EventID',
    'ProviderGuid',
    'Version',
    'Task',
    'OpcodeValue',
    'RecordNumber',
    'ThreadID',
    'Channel',
    'Domain',
    'AccountName',
    'UserID',
    'AccountType',
    'Opcode',
    'RuleId',
    'RuleName',
    'Origin',
    'ApplicationPath',
    'Direction',
    'Protocol',
    'LocalPorts',
    'RemotePorts',
    'Action',
    'Profiles',
    'LocalAddresses',
    'RemoteAddresses',
    'Flags',
    'Active',
    'EdgeTraversal',
    'LooseSourceMapped',
    'SecurityOptions',
    'ModifyingUser',
    'ModifyingApplication',
    'SchemaVersion',
    'RuleStatus',
    'LocalOnlyMapped',
    'ErrorCode',
    'EventReceivedTime',
    'SourceModuleName',
    'SourceModuleType'

]

BODY_KEY_SET = set(DICT_KEY_LIST_BODY)
print(BODY_KEY_SET)

def strip_list():
    a_list = list(set(DICT_KEY_LIST_BODY))
    for e in a_list:
        print(a_list)


def insert_data(data):
    

    timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S.%f%z')
    event_received_time = datetime.strptime(data['event_received_time'], '%Y-%m-%d %H:%M:%S')
    if event_received_time:
            event_received_time = timezone.make_aware(event_received_time, timezone.get_current_timezone())

    BronzeEventData.objects.create(
        # headers
            priority=int(data.get('priority', 0)),
            version=int(data.get('version', 0)),
            timestamp=timestamp,
            hostname=data.get('hostname', ''),
            app_name=data.get('app_name', ''),
            process_id=int(data.get('process_id', 0)),
        
        # body
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
        
        # message
            message=data.get('message', '')
        )

def parse_header_fields(header):

    header_dict = dict()
    
    # to get the priority value from header

    split_pri_from_headers = re.split(r'(?<=\>)', header)
    pri_str = split_pri_from_headers[0]
    pri = pri_str.replace('<', '').replace('>', '')

    # to place the rest of the header fields in a list

    headers_list = split_pri_from_headers[1].split(" ")

    #store all header fields in a dict

    header_dict["priority"] = int(pri)
    header_dict["h_version"] = int(headers_list[0])
    header_dict["iso_timestamp"] = headers_list[1]
    header_dict["hostname"] = headers_list[2]
    header_dict["app_name"] = headers_list[3]
    header_dict["process_id"] = headers_list[4]

    return header_dict

def parse_body_fields(body):

    temp_body_dict = dict()

    body_dict = dict()

    # place body fields into a dict

    pattern = r'(\w+)="([^"]*)"'
    matches = re.findall(pattern, body)
    temp_body_dict = {key: value for key, value in matches}

    # create a new dict with required fields and filter out unneeded fields

    for key, value in temp_body_dict.items():
        if key in BODY_KEY_SET:
            body_dict[key] = value
            # print(key)
    # print(" ")

    # print(body_dict)
    # print(" ")
    



    

    # body_list = body.split(" ")
    # print(body_list)
    # print(" ")


    return body_dict


def parse_line(line):

    try:
        # TODO

        """
        1. Place text line into header, body, message strings
        2. Parse the header into fields
        3. Parse the body into fields
        """
        
        if re.search(r'(?<!\S)-(?!\S)', line):

            split_header_from_body_message = line.split(" - ")

            split_body_from_message = re.split(r'(?<=\])', split_header_from_body_message[1])
            
            header_str = split_header_from_body_message[0]
            body_str = split_body_from_message[0]
            message_str = split_body_from_message[1]

            header_dict = parse_header_fields(header_str)
            body_dict = parse_body_fields(body_str)

            # merge the 2 dictionary's

            log_dict = dict()
            log_dict.update(header_dict)
            log_dict.update(body_dict)
            
            # add message to dict

            log_dict["message"] = message_str

            print(log_dict)
            print(" ")


            # strip_list()



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


    