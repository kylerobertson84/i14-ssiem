# Generated by Django 5.1.1 on 2024-09-17 05:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0004_incidentreport_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='incidentreport',
            name='source',
        ),
    ]
