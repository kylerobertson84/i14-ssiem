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
                if str(event.EventID) != str(value):
                    return False
            elif key == 'frequency':
                if not self._check_frequency(event, value):
                    return False
            elif key == 'Channel':
                if isinstance(value, list):
                    if event.Channel not in value:
                        return False
                elif event.Channel != value:
                    return False
        return True

    def _check_frequency(self, event, frequency):
        count = frequency['count']
        timeframe = frequency['timeframe']
        timeframe_minutes = int(timeframe[:-1])
        start_time = event.iso_timestamp - timedelta(minutes=timeframe_minutes)
        
        similar_events = BronzeEventData.objects.filter(
            EventID=event.EventID,
            iso_timestamp__gte=start_time,
            iso_timestamp__lte=event.iso_timestamp,
            Channel__in=["Application", "Security"]
        ).count()
        
        return similar_events >= count