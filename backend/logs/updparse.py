import socket
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
import pytz

from logs.management.commands.constants import *

#
# Shamelessly rip the work kyle has done and adapt it to upd messages
#



class SyslogUDPServer:

    def __init__(self, host="0.0.0.0", port=514, output_file="received_syslog.txt"):
        self.host = host
        self.port = port
        self.output_file = output_file

    def start(self):
        # Set up a UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind((self.host, self.port))

        print(f"Listening for UDP syslog messages on {self.host}:{self.port}...")
        
        try:
            with open(self.output_file, 'a') as file:  # Open file in append mode
                while True:
                    # Receive syslog packet
                    data, addr = sock.recvfrom(4096)  # Buffer size of 4096 bytes
                    syslog_message = data.decode('utf-8').strip()
                    
                    # Add a timestamp to each message
                    #formatted_message = f"{timestamp} {syslog_message}"

                    # Print to the terminal
                    print(f"Received message from {addr}: {syslog_message}")
                    
                    # Write to the file
                    file.write(syslog_message + "\n")

        except KeyboardInterrupt:
            print("\nServer stopped.")
        except Exception as e:
            print(f"Error receiving syslog messages: {e}")
        finally:
            sock.close()



def insert_data(data):

    
    try:

        iso_ts = parse_timestamp_utc(data, 'iso_timestamp')
        event_ts = parse_timestamp_utc(data, 'EventReceivedTime')

        BronzeEventData.objects.create(
            # headers
                priority=int(data.get('priority', 0)),
                h_version=int(data.get('h_version', 0)),
                iso_timestamp = iso_ts,
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
                EventReceivedTime = event_ts,
                SourceModuleName = data.get('SourceModuleName', ''),
                SourceModuleType = data.get('SourceModuleType', ''),
                
            # message
                message=data.get('message', ''),

            # extra fields
                extra_fields = data.get('extra_fields',''),
            )
    except Exception as e:
        print(f"Error inserting data: {data}\nError: {e}")

def parse_timestamp_utc(dictionary, key):

    timestamp_str = dictionary.get(key, '')
    timestamp = None

    if timestamp_str:
        timestamp = datetime.fromisoformat(timestamp_str)

        if timestamp.tzinfo is None:
            timestamp = pytz.utc.localize(timestamp)
        
        else:
            timestamp = timestamp.astimezone(pytz.utc)
    
    return timestamp

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

def separate_head_body_msg(line, char):

    split_header_from_body_message = line.split(char)

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

def separate_head_body_msg_when_bug_in_log(line, char):
    
    split_head_from_body_msg = line.split(char, 1)
    split_hex_from_head = split_head_from_body_msg[0].split('{')

    split_body_from_message = re.split(r'(?<=\])', split_head_from_body_msg[1])

    # print(split_body_from_message[0])

    header_str = split_hex_from_head[0]
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


def parse_line(line):

    try:
        
        
        if re.search(r'(?<!\S)-(?!\S)', line):

            separate_head_body_msg(line, ' - ')
        
        else:

            separate_head_body_msg_when_bug_in_log(line, '} ')
            

    except Exception as e:
        print(f"Error processing line: {line}\nError: {e}")



#
# Shamelessly rip the work kyle has done 
#

# class Command(BaseCommand):

#     def add_arguments(self, parser):
#         parser.add_argument('logfile', type=str, help='The path to the log file')

#     def handle(self, *args, **kwargs):
#         logfile = kwargs['logfile']
#         try:
#             with open(logfile, 'r') as file:
#                 for line in file:
#                     parse_line(line)
#             self.stdout.write(self.style.SUCCESS('Successfully parsed the log file'))
#         except FileNotFoundError:
#             self.stdout.write(self.style.ERROR(f'File not found: {logfile}'))
#         except Exception as e:
#             self.stdout.write(self.style.ERROR(f'Error processing log file: {e}'))


    


if __name__ == "__main__":
    server = SyslogUDPServer(host="0.0.0.0", port=514, output_file="received_syslog.txt")
    server.start()