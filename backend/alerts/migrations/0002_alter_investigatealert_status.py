# Generated by Django 5.1.1 on 2024-09-06 00:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='investigatealert',
            name='status',
            field=models.CharField(choices=[('OPEN', 'Open'), ('IN PROGRESS', 'In Progress'), ('CLOSED', 'Closed')], default='OPEN', max_length=20),
        ),
    ]
