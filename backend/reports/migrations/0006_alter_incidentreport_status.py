# Generated by Django 5.1.1 on 2024-09-17 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0005_remove_incidentreport_source'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidentreport',
            name='status',
            field=models.CharField(choices=[('open', 'Open'), ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('archived', 'Archived')], default='open', max_length=10),
        ),
    ]
