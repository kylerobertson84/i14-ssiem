# Generated by Django 5.1 on 2024-09-02 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0003_bronzeeventdata_processed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='processed',
            field=models.IntegerField(default=0),
        ),
    ]
