# Generated by Django 5.1.1 on 2024-09-17 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0002_alter_incidentreport_options_incidentreport_pdf_file_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidentreport',
            name='status',
            field=models.CharField(choices=[('draft', 'Draft'), ('ongoing', 'Ongoing'), ('closed', 'Closed'), ('archived', 'Archived')], default='draft', max_length=10),
        ),
    ]