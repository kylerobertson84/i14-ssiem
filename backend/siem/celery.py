"""
This file is essential for integrating Celery with the Django project.
It sets up the necessary configuration for Celery to work with Django's settings and to discover tasks defined in the Django apps.
"""

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'siem.settings')

app = Celery('siem')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

