# Generated by Django 5.1.2 on 2024-10-16 01:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0004_alter_bronzeeventdata_processed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='routerdata',
            name='date_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
