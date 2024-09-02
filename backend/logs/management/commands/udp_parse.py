import socket
import re
from datetime import datetime
import pytz
from django.core.management.base import BaseCommand
from logs.models import *
from logs.management.commands.constants import BODY_KEY_SET

# constant regular expressions

SEVERITY_RE = r'(?<=\>)'
DATE_TIME_RE = r'(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})'

class Command(BaseCommand):
    help = 'Runs the UDP parser script'

    def handle(self, *args, **kwargs):
        server = SyslogUDPServer(host="0.0.0.0", port=514)
        server.start()


class SyslogUDPServer:
    def __init__(self, host="0.0.0.0", port=514):
        self.host = host
        self.port = port

    def start(self):
        # Set up a UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind((self.host, self.port))

        print(f"Listening for UDP syslog messages on {self.host}:{self.port}...")
        try:
            while True:
                # Receive syslog packet
                data, addr = sock.recvfrom(4096)  # Buffer size of 4096 bytes
                syslog_message = data.decode('utf-8').strip()

                # Process and insert data
                #parse_line(syslog_message)
                
                if "NXLOG" in syslog_message:
                    parse_line(syslog_message)
                else:
                    parse_router_line(syslog_message)

                # Print to the terminal
                print(f"Received message from {addr}: {syslog_message}")

        except KeyboardInterrupt:
            print("\nServer stopped.")
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
            iso_timestamp=iso_ts,
            processed = data.get('processed', False),
            hostname=data.get('hostname', ''),
            app_name=data.get('app_name', ''),
            process_id=data.get('process_id', ''),

            # body
            Keywords=data.get('Keywords', ''),
            EventType=data.get('EventType', ''),
            EventID=data.get('EventID', ''),
            ProviderGuid=data.get('ProviderGuid', ''),
            Version=data.get('Version', ''),
            Task=data.get('Task', ''),
            OpcodeValue=data.get('OpcodeValue', ''),
            RecordNumber=data.get('RecordNumber', ''),
            ActivityID=data.get('ActivityID', ''),
            ThreadID=data.get('ThreadID', ''),
            Channel=data.get('Channel', ''),
            Domain=data.get('Domain', ''),
            AccountName=data.get('AccountName', ''),
            UserID=data.get('UserID', ''),
            AccountType=data.get('AccountType', ''),
            Opcode=data.get('Opcode', ''),
            PackageName=data.get('PackageName', ''),
            ContainerId=data.get('ContainerId', ''),
            EventReceivedTime=event_ts,
            SourceModuleName=data.get('SourceModuleName', ''),
            SourceModuleType=data.get('SourceModuleType', ''),

            # message
            message=data.get('message', ''),

            # extra fields
            extra_fields=data.get('extra_fields', ''),
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

    # Get the priority value from header
    split_pri_from_headers = re.split(r'(?<=\>)', header)
    pri_str = split_pri_from_headers[0]
    pri = pri_str.replace('<', '').replace('>', '')

    # Place the rest of the header fields in a list
    headers_list = split_pri_from_headers[1].split(" ")

    # Store all header fields in a dict
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

    # Place body fields into a dict
    pattern = r'(\w+)="([^"]*)"'
    matches = re.findall(pattern, body)
    temp_body_dict = {key: value for key, value in matches}

    # Create a new dict with required fields and filter out unneeded fields
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

    # Store the extra fields in a string
    extra_fields_str = str(extra_fields_dict)

    # Merge the two dictionaries into log_dict
    log_dict = {**header_dict, **body_dict, "message": message_str.strip(), "extra_fields": extra_fields_str}

    insert_data(log_dict)


def separate_head_body_msg_when_bug_in_log(line, char):
    split_head_from_body_msg = line.split(char, 1)
    split_hex_from_head = split_head_from_body_msg[0].split('{')

    split_body_from_message = re.split(r'(?<=\])', split_head_from_body_msg[1])

    header_str = split_hex_from_head[0]
    body_str = split_body_from_message[0]
    message_str = split_body_from_message[1]

    header_dict = parse_header_fields(header_str)
    body_dict, extra_fields_dict = parse_body_fields(body_str)

    # Store the extra fields in a string
    extra_fields_str = str(extra_fields_dict)

    # Merge the two dictionaries into log_dict
    log_dict = {**header_dict, **body_dict, "message": message_str.strip(), "extra_fields": extra_fields_str}

    insert_data(log_dict)

def insert_router_data(a_dict):

    try:
        RouterData.objects.create(
            severity = a_dict.get('severity', 0),
            date_time = a_dict.get('date_time', ''),
            hostname = a_dict.get('hostname', ''),
            process = a_dict.get('process', ''),
            message = a_dict.get('message', ''),
        )
    
    except Exception as e:
        print(f"Error inserting data: {a_dict}\nError: {e}")



def parse_router_line(line):

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
        hostname = split_host_from_header[0]
        # print(hostname)

        # to get process

        check_process = split_host_from_header[1]
        # print(split_host_from_header)

        # check if process contains a comma:

        if "," in check_process:
            remove_comma = check_process.replace(",", " ", 1)
            split_process_from_msg = remove_comma.split()
            process = split_process_from_msg[0]
        else:
            process = check_process.replace(":","")
           
        
        # to get the message

        # check if element contains a comma and remove it if it does

        if "," in split_host_from_header[1]: 
            split_host_from_header[1] = split_host_from_header[1].replace(",", " ", 1)
            list_to_string = " ".join(split_host_from_header)
            split_string = list_to_string.split()

            # remove the first 2 elements from the list

            slice_list = split_string[2:]
            message = " ".join(slice_list)
        
        else:
            
            slice_list = split_host_from_header[2:]
            message = " ".join(slice_list)

        # place router fields into a dictionary
        
        log_dict = dict()

        log_dict["severity"] = int(severity)
        log_dict["date_time"] = date_time
        log_dict["hostname"] = hostname
        log_dict["process"] = process
        log_dict["message"] = message

        insert_router_data(log_dict)
            


    except Exception as e:
        print(f"Error processing line: {line}\nError: {e}")



def parse_line(line):
    try:
        if re.search(r'(?<!\S)-(?!\S)', line):
            separate_head_body_msg(line, ' - ')
        else:
            separate_head_body_msg_when_bug_in_log(line, '} ')
    except Exception as e:
        print(f"Error processing line: {line}\nError: {e}")


if __name__ == "__main__":
    server = SyslogUDPServer(host="0.0.0.0", port=514)
    server.start()