# Generated by Django 5.1 on 2024-09-02 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0002_remove_bronzeeventdata_processed'),
    ]

    operations = [
        migrations.AddField(
            model_name='bronzeeventdata',
            name='processed',
            field=models.BooleanField(default=False),
        ),
    ]