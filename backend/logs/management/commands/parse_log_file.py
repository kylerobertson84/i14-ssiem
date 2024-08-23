
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
import pytz

from logs.management.commands.constants import *


def insert_data(data):

    
    try:

        iso_timestamp_str = data.get('iso_timestamp', '')
        iso_timestamp = None

        if iso_timestamp_str:
            iso_timestamp = datetime.fromisoformat(iso_timestamp_str)
           
            if iso_timestamp.tzinfo is not None:
                iso_timestamp = iso_timestamp.astimezone(pytz.utc).replace(tzinfo=None)

            else:
                pass

        BronzeEventData.objects.create(
            # headers
                priority=int(data.get('priority', 0)),
                h_version=int(data.get('h_version', 0)),
                iso_timestamp= data.get('iso_timestamp',''),
                hostname=data.get('hostname', ''),
                app_name=data.get('app_name', ''),
                process_id= data.get('process_id', ''),
            
            # body
                Keywords = data.get('Keywords', ''),
                EventType = data.get('EventType', ''),
                EventID = data.get('EventID', ''),
                ProviderGuid = data.get('ProviderGuid', ''),
                Version = data.get('Version', ''),
                Task = data.get('Task', ''),
                OpcodeValue = data.get('OpcodeValue', ''),
                RecordNumber = data.get('RecordNumber', ''),
                ActivityID = data.get('ActivityID', ''),
                ThreadID = data.get('ThreadID', ''),
                Channel = data.get('Channel', ''),
                Domain = data.get('Domain', ''),
                AccountName = data.get('AccountName', ''),
                UserID = data.get('UserID', ''),
                AccountType = data.get('AccountType', ''),
                Opcode = data.get('Opcode', ''),
                PackageName = data.get('PackageName', ''),
                ContainerId = data.get('ContainerId', ''),
                EventReceivedTime = data.get('EventReceivedTime', ''),
                SourceModuleName = data.get('SourceModuleName', ''),
                SourceModuleType = data.get('SourceModuleType', ''),
                
            # message
                message=data.get('message', ''),

            # extra fields
                extra_fields = data.get('extra_fields',''),
            )
    except Exception as e:
        print(f"Error inserting data: {data}\nError: {e}")

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
    extra_fields_dict = dict()

    # place body fields into a dict

    pattern = r'(\w+)="([^"]*)"'
    matches = re.findall(pattern, body)
    temp_body_dict = {key: value for key, value in matches}

    # create a new dict with required fields and filter out unneeded fields
    # filtered out fields placed in extra_fields_dict

    for key, value in temp_body_dict.items():
        if key in BODY_KEY_SET:
            body_dict[key] = value
        else:
            extra_fields_dict[key] = value 

    return body_dict, extra_fields_dict


def parse_line(line):

    try:
        
        if re.search(r'(?<!\S)-(?!\S)', line):

            split_header_from_body_message = line.split(" - ")

            split_body_from_message = re.split(r'(?<=\])', split_header_from_body_message[1])
            
            header_str = split_header_from_body_message[0]
            body_str = split_body_from_message[0]
            message_str = split_body_from_message[1]

            header_dict = parse_header_fields(header_str)
            body_dict, extra_fields_dict = parse_body_fields(body_str)

            # to store the extra fields in a string

            extra_fields_str = str(extra_fields_dict)

            # merge the 2 dictionary's into log_dict

            log_dict = dict()
            log_dict = {**header_dict, **body_dict, "message": message_str.strip(), "extra_fields": extra_fields_str}

         
            insert_data(log_dict)

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


    