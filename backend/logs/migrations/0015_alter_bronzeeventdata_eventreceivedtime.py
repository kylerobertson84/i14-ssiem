# Generated by Django 5.1 on 2024-08-23 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0014_alter_bronzeeventdata_iso_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='EventReceivedTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
