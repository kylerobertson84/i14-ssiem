
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
from django.utils import timezone

LOG_PATTERN = re.compile(
    r'<(?P<priority>\d+)>'
    r'(?P<version>\d)\s+'                 
    r'(?P<timestamp>[\d\-T:\.\+]+)\s+'     
    r'(?P<hostname>[^\s]+)\s+'             
    r'(?P<app_name>[^\s]+)\s+'             
    r'(?P<process_id>\d+)\s+-\s+'         
    r'\[NXLOG@14506\s+'                   
    r'Keywords="(?P<nxlog_keywords>[^"]+)"\s+' 
    r'EventType="(?P<event_type>[^"]+)"\s+'     
    r'EventID="(?P<event_id>\d+)"\s+'          
    r'ProviderGuid="(?P<provider_guid>{[^}]+})"\s+' 
    r'Version="(?P<version_inner>\d+)"\s+'          
    r'Task="(?P<task>[^"]+)"\s+'  
    r'OpcodeValue="(?P<opcode_value>\d+)"\s+'      
    r'RecordNumber="(?P<record_number>\d+)"\s+' 
    r'ThreadID="(?P<thread_id>\d+)"\s+'           
    r'Channel="(?P<channel>[^"]+)"\s+'             
    r'Opcode="(?P<opcode>[^"]+)"\s+'               
    r'(?:OperationName="(?P<operation_name>[^"]+)"\s+'  
    r'OperationType="(?P<operation_type>\d+)"\s+'       
    r'OperationId="(?P<operation_id>\d+)"\s+'           
    r'ExecutionTimeMS="(?P<execution_time_ms>\d+)"\s+'  
    r'QueuedTimeMS="(?P<queued_time_ms>\d+)"\s+'        
    r'SLAThresholdMS="(?P<sla_threshold_ms>\d+)"\s+'    
    r'ContextType1="(?P<context_type1>\d+)"\s+'         
    r'ContextInfo1="(?P<context_info1>[^"]+)"\s+'       
    r'ContextType2="(?P<context_type2>\d+)"\s+'         
    r'ContextInfo2="(?P<context_info2>[^"]+)"\s+'      
    r'ContextType3="(?P<context_type3>\d+)"\s+'         
    r'ContextInfo3="(?P<context_info3>[^"]*)"\s+)?'     
    r'EventReceivedTime="(?P<event_received_time>[^"]+)"\s+'
    r'SourceModuleName="(?P<source_module_name>[^"]+)"\s+'
    r'SourceModuleType="(?P<source_module_type>[^"]+)"\]\s+'
    r'(?P<message>.+)$'                                
)

def parse_line(line):

    try:
        match = LOG_PATTERN.match(line)

        if match:
            data = match.groupdict()

            timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S.%f%z')
            event_received_time = datetime.strptime(data['event_received_time'], '%Y-%m-%d %H:%M:%S')
            event_received_time = timezone.make_aware(event_received_time, timezone.get_current_timezone())

            BronzeEventData.objects.create(
                priority=int(data['priority']),
                version=int(data['version']),
                timestamp=timestamp,
                hostname=data['hostname'],
                app_name=data['app_name'],
                process_id=int(data['process_id']),
                nxlog_keywords=data['nxlog_keywords'],
                event_type=data['event_type'],
                event_id=int(data['event_id']),
                provider_guid=data['provider_guid'],
                task=data['task'],
                opcode_value=int(data['opcode_value']),
                record_number=int(data['record_number']),
                thread_id=int(data['thread_id']),
                channel=data['channel'],
                opcode=data['opcode'],
                operation_name=data.get('operation_name'),
                operation_type=int(data.get('operation_type', 0)),
                operation_id=int(data.get('operation_id', 0)),
                execution_time_ms=int(data.get('execution_time_ms', 0)),
                queued_time_ms=int(data.get('queued_time_ms', 0)),
                sla_threshold_ms=int(data.get('sla_threshold_ms', 0)),
                context_type1=int(data.get('context_type1', 0)),
                context_info1=data.get('context_info1'),
                context_type2=int(data.get('context_type2', 0)),
                context_info2=data.get('context_info2'),
                context_type3=int(data.get('context_type3', 0)),
                context_info3=data.get('context_info3'),
                event_received_time=event_received_time,
                source_module_name=data['source_module_name'],
                source_module_type=data['source_module_type'],
                message=data['message'],
            )

        else:
            print(f"Line did not match: {line.strip()}")
            
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


    