
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
import pytz

import logging

logger = logging.getLogger(__name__)



# constant regular expressions

SEVERITY_RE = r'(?<=\>)'
DATE_TIME_RE = r'(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})'

def insert_data(a_dict):

    try:

        iso_time_stamp = parse_timestamp_utc(a_dict,'date_time')

        RouterData.objects.create(
            severity = a_dict.get('severity', 0),
            # date_time = a_dict.get('date_time', ''),
            date_time = iso_time_stamp,
            hostname = a_dict.get('hostname', ''),
            process = a_dict.get('process', ''),
            message = a_dict.get('message', ''),
        )
    
    except Exception as e:
        print(f"Error inserting data: {a_dict}\nError: {e}")

def convert_network_dt_into_iso(network_dt):
    dt = datetime.strptime(network_dt, "%b %d %H:%M:%S")
    current_year = datetime.now().year
    dt = dt.replace(year=current_year)
    logger.info(f"Converted datetime: {dt.isoformat()}")
    return dt.isoformat()

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

        network_iso = convert_network_dt_into_iso(date_time)
        print("network_iso", network_iso)
        
        log_dict = dict()

        log_dict["severity"] = int(severity)
        log_dict["date_time"] = network_iso 
        log_dict["hostname"] = hostname
        log_dict["process"] = process
        log_dict["message"] = message

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
