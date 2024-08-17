import json
from datetime import datetime, timedelta
from django.utils import timezone
from core.models import Rule
from logs.models import BronzeEventData

class RuleEngine:
    def __init__(self):
        self.rules = list(Rule.objects.all())

    def match_rule(self, event):
        matched_rules = []
        for rule in self.rules:
            conditions = json.loads(rule.conditions)
            if self._check_conditions(event, conditions):
                matched_rules.append(rule)
        return matched_rules

    def _check_conditions(self, event, conditions):
        for key, value in conditions.items():
            if key == 'EventID':
                if int(event.EventID) != value:
                    return False
            elif key == 'frequency':
                if not self._check_frequency(event, value):
                    return False
            elif key == 'time_range':
                if not self._check_time_range(event, value):
                    return False
        return True

    def _check_frequency(self, event, frequency):
        count = frequency['count']
        timeframe = frequency['timeframe']
        timeframe_minutes = int(timeframe[:-1])
        start_time = timezone.now() - timedelta(minutes=timeframe_minutes)
        
        similar_events = BronzeEventData.objects.filter(
            EventID=event.EventID,
            iso_timestamp__gte=start_time
        ).count()
        
        return similar_events >= count

    def _check_time_range(self, event, time_range):
        event_time = datetime.strptime(event.iso_timestamp, '%Y-%m-%dT%H:%M:%S.%f%z').time()
        start_time = datetime.strptime(time_range['start'], '%H:%M').time()
        end_time = datetime.strptime(time_range['end'], '%H:%M').time()
        
        if start_time < end_time:
            return not (start_time <= event_time <= end_time)
        else:  # Range spans midnight
            return not (start_time <= event_time or event_time <= end_time)