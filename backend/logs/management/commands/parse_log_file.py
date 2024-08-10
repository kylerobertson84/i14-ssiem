
from django.core.management.base import BaseCommand
from logs.models import *
import re
from datetime import datetime
from django.utils import timezone

# LOG_PATTERN = re.compile(
#     r'<(?P<priority>\d+)>'                                      # Priority
#     r'(?P<version>\d)\s+'                                       # Version
#     r'(?P<timestamp>[\d\-T:\.\+]+)\s+'                          # Timestamp
#     r'(?P<hostname>[^\s]+)\s+'                                  # Hostname
#     r'(?P<app_name>[^\s]+)\s+'                                  # App Name
#     r'(?P<process_id>\d+)\s+-\s+'                               # Process ID
#     r'\[NXLOG@14506\s+'                                         # NXLOG start
#     r'Keywords="(?P<nxlog_keywords>[^"]+)"\s+'                  # NXLOG Keywords
#     r'EventType="(?P<event_type>[^"]+)"\s+'                     # Event Type
#     r'EventID="(?P<event_id>\d+)"\s+'                           # Event ID
#     r'ProviderGuid="(?P<provider_guid>{[^}]+})"\s+'             # Provider GUID
#     r'Version="(?P<version_inner>\d+)"\s+'                      # Version (inner)
#     r'Task="(?P<task>[^"]+)"\s+'                                # Task
#     r'OpcodeValue="(?P<opcode_value>\d+)"\s+'                   # Opcode Value
#     r'RecordNumber="(?P<record_number>\d+)"\s+'                 # Record Number
#     r'ThreadID="(?P<thread_id>\d+)"\s+'                         # Thread ID
#     r'Channel="(?P<channel>[^"]+)"\s+'                          # Channel
#     r'Opcode="(?P<opcode>[^"]+)"\s+'                            # Opcode
#     r'(?:OperationName="(?P<operation_name>[^"]+)"\s+'          # Optional Operation Name
#     r'OperationType="(?P<operation_type>\d+)"\s+'               # Optional Operation Type
#     r'OperationId="(?P<operation_id>\d+)"\s+'                   # Optional Operation ID
#     r'ExecutionTimeMS="(?P<execution_time_ms>\d+)"\s+'          # Optional Execution Time
#     r'QueuedTimeMS="(?P<queued_time_ms>\d+)"\s+'                # Optional Queued Time
#     r'SLAThresholdMS="(?P<sla_threshold_ms>\d+)"\s+'            # Optional SLA Threshold
#     r'ContextType1="(?P<context_type1>\d+)"\s+'                 # Optional Context Type 1
#     r'ContextInfo1="(?P<context_info1>[^"]+)"\s+'               # Optional Context Info 1
#     r'ContextType2="(?P<context_type2>\d+)"\s+'                 # Optional Context Type 2
#     r'ContextInfo2="(?P<context_info2>[^"]+)"\s+'               # Optional Context Info 2
#     r'ContextType3="(?P<context_type3>\d+)"\s+'                 # Optional Context Type 3
#     r'ContextInfo3="(?P<context_info3>[^"]*)"\s+)?'             # Optional Context Info 3
#     r'EventReceivedTime="(?P<event_received_time>[^"]+)"\s+'    # Event Received Time
#     r'SourceModuleName="(?P<source_module_name>[^"]+)"\s+'      # Source Module Name
#     r'SourceModuleType="(?P<source_module_type>[^"]+)"\]\s+'    # Source Module Type
#     r'(?P<message>.+)$'                                         # Message
# )

# LOG_PATTERN_1 = re.compile(
#     r'<(?P<priority>\d+)>'                     
#     r'(?P<version>\d)\s+'                      
#     r'(?P<timestamp>[\d\-T:\.\+]+)\s+'         
#     r'(?P<hostname>[^\s]+)\s+'                 
#     r'(?P<app_name>[^\s]+)\s+'                 
#     r'(?P<process_id>\d+)\s+-\s+'              
#     r'\[NXLOG@14506\s+'                        
#     r'Keywords="(?P<nxlog_keywords>[^"]+)"\s+' 
#     r'EventType="(?P<event_type>[^"]+)"\s+'    
#     r'EventID="(?P<event_id>\d+)"\s+'          
#     r'ProviderGuid="(?P<provider_guid>{[^}]+})"\s+'  
#     r'Version="(?P<version_inner>\d+)"\s+'     
#     r'Task="(?P<task>[^"]+)"\s+'               
#     r'OpcodeValue="(?P<opcode_value>\d+)"\s+'  
#     r'RecordNumber="(?P<record_number>\d+)"\s+'
#     r'ThreadID="(?P<thread_id>\d+)"\s+'        
#     r'Channel="(?P<channel>[^"]+)"\s+'         
#     r'Opcode="(?P<opcode>[^"]+)"\s+'           
#     r'OperationName="(?P<operation_name>[^"]+)"\s+'  
#     r'OperationType="(?P<operation_type>\d+)"\s+'     
#     r'OperationId="(?P<operation_id>\d+)"\s+'         
#     r'ExecutionTimeMS="(?P<execution_time_ms>\d+)"\s+'
#     r'QueuedTimeMS="(?P<queued_time_ms>\d+)"\s+'        
#     r'SLAThresholdMS="(?P<sla_threshold_ms>\d+)"\s+'    
#     r'ContextType1="(?P<context_type1>\d+)"\s+'         
#     r'ContextInfo1="(?P<context_info1>[^"]+)"\s+'       
#     r'ContextType2="(?P<context_type2>\d+)"\s+'         
#     r'ContextInfo2="(?P<context_info2>[^"]+)"\s+'       
#     r'ContextType3="(?P<context_type3>\d+)"\s+'         
#     r'ContextInfo3="(?P<context_info3>[^"]*)"\s+'       
#     r'EventReceivedTime="(?P<event_received_time>[^"]+)"\s+'  
#     r'SourceModuleName="(?P<source_module_name>[^"]+)"\s+'     
#     r'SourceModuleType="(?P<source_module_type>[^"]+)"\]\s+'   
#     r'(?P<message>.+)$'
# )

# LOG_PATTERN_2 = re.compile(
#     r'<(?P<priority>\d+)>'                     
#     r'(?P<version>\d)\s+'                      
#     r'(?P<timestamp>[\d\-T:\.\+]+)\s+'         
#     r'(?P<hostname>[^\s]+)\s+'                 
#     r'(?P<app_name>[^\s]+)\s+'                 
#     r'(?P<process_id>\d+)\s+-\s+'              
#     r'\[NXLOG@14506\s+'                        
#     r'Keywords="(?P<nxlog_keywords>[^"]+)"\s+' 
#     r'EventType="(?P<event_type>[^"]+)"\s+'    
#     r'EventID="(?P<event_id>\d+)"\s+'          
#     r'ProviderGuid="(?P<provider_guid>{[^}]+})"\s+'  
#     r'Version="(?P<version_inner>\d+)"\s+'     
#     r'Task="(?P<task>[^"]+)"\s+'               
#     r'OpcodeValue="(?P<opcode_value>\d+)"\s+'  
#     r'RecordNumber="(?P<record_number>\d+)"\s+'
#     r'ThreadID="(?P<thread_id>\d+)"\s+'        
#     r'Channel="(?P<channel>[^"]+)"\s+'         
#     r'Domain="(?P<domain>[^"]+)"\s+'           
#     r'AccountName="(?P<account_name>[^"]+)"\s+'
#     r'UserID="(?P<user_id>[^"]+)"\s+'          
#     r'AccountType="(?P<account_type>[^"]+)"\s+'
#     r'Category="(?P<category>[^"]+)"\s+'       
#     r'Opcode="(?P<opcode>[^"]+)"\s+'           
#     r'Function="(?P<function>[^"]+)"\s+'       
#     r'Source="(?P<source>[^"]+)"\s+'           
#     r'Line_Number="(?P<line_number>\d+)"\s+'   
#     r'EventReceivedTime="(?P<event_received_time>[^"]+)"\s+'  
#     r'SourceModuleName="(?P<source_module_name>[^"]+)"\s+'     
#     r'SourceModuleType="(?P<source_module_type>[^"]+)"\]\s+'   
#     r'(?P<message>.+)$'
# )

LOG_PATTERN_GENERAL = re.compile(
    r'<(?P<priority>\d+)>'                     
    r'(?P<version>\d)?\s*'                     
    r'(?P<timestamp>[\d\-T:\.\+]+)?\s*'        
    r'(?P<hostname>[^\s]+)?\s*'                
    r'(?P<app_name>[^\s]+)?\s*'                
    r'(?P<process_id>\d+)?\s*-?\s*'            
    r'(?:\[NXLOG@14506\s*)?'                   
    r'(?:Keywords="(?P<nxlog_keywords>[^"]+)")?\s*'
    r'(?:EventType="(?P<event_type>[^"]+)")?\s*'
    r'(?:EventID="(?P<event_id>\d+)")?\s*'
    r'(?:ProviderGuid="(?P<provider_guid>{[^}]+})")?\s*'
    r'(?:Version="(?P<version_inner>\d+)")?\s*'
    r'(?:Task="(?P<task>[^"]+)")?\s*'
    r'(?:OpcodeValue="(?P<opcode_value>\d+)")?\s*'
    r'(?:RecordNumber="(?P<record_number>\d+)")?\s*'
    r'(?:ThreadID="(?P<thread_id>\d+)")?\s*'
    r'(?:Channel="(?P<channel>[^"]+)")?\s*'
    r'(?:Domain="(?P<domain>[^"]+)")?\s*'
    r'(?:AccountName="(?P<account_name>[^"]+)")?\s*'
    r'(?:UserID="(?P<user_id>[^"]+)")?\s*'
    r'(?:AccountType="(?P<account_type>[^"]+)")?\s*'
    r'(?:Category="(?P<category>[^"]+)")?\s*'
    r'(?:Opcode="(?P<opcode>[^"]+)")?\s*'
    r'(?:Function="(?P<function>[^"]+)")?\s*'
    r'(?:Source="(?P<source>[^"]+)")?\s*'
    r'(?:Line_Number="(?P<line_number>\d+)")?\s*'
    r'(?:OperationName="(?P<operation_name>[^"]+)")?\s*'
    r'(?:OperationType="(?P<operation_type>\d+)")?\s*'
    r'(?:OperationId="(?P<operation_id>\d+)")?\s*'
    r'(?:ExecutionTimeMS="(?P<execution_time_ms>\d+)")?\s*'
    r'(?:QueuedTimeMS="(?P<queued_time_ms>\d+)")?\s*'
    r'(?:SLAThresholdMS="(?P<sla_threshold_ms>\d+)")?\s*'
    r'(?:ContextType1="(?P<context_type1>\d+)")?\s*'
    r'(?:ContextInfo1="(?P<context_info1>[^"]+)")?\s*'
    r'(?:ContextType2="(?P<context_type2>\d+)")?\s*'
    r'(?:ContextInfo2="(?P<context_info2>[^"]+)")?\s*'
    r'(?:ContextType3="(?P<context_type3>\d+)")?\s*'
    r'(?:ContextInfo3="(?P<context_info3>[^"]*)")?\s*'
    r'(?:EventReceivedTime="(?P<event_received_time>[^"]+)")?\s*'
    r'(?:SourceModuleName="(?P<source_module_name>[^"]+)")?\s*'
    r'(?:SourceModuleType="(?P<source_module_type>[^"]+)")?\s*'
    r'\]?\s*'  
    r'(?P<message>.+)?$'
)



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
    

def parse_line(line):

    try:
        # match_1 = LOG_PATTERN_1.match(line)
        # match_2 = LOG_PATTERN_2.match(line)

        match = LOG_PATTERN_GENERAL.match(line)

        # if match_1:
        #     data = match_1.groupdict()
        #     insert_data(data)

        # elif match_2:
        #     data = match_2.groupdict()
        #     insert_data(data)
        
        if match:
            data = match.groupdict()
            insert_data(data)

        else:
            print(f"Line did not match: {line.strip()}")
            exit()

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


    