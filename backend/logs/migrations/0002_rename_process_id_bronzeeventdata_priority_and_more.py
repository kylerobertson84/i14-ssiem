# Generated by Django 5.0.7 on 2024-08-08 03:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bronzeeventdata',
            old_name='process_id',
            new_name='priority',
        ),
        migrations.RemoveField(
            model_name='bronzeeventdata',
            name='severity',
        ),
        migrations.RemoveField(
            model_name='bronzeeventdata',
            name='severity_value',
        ),
        migrations.RemoveField(
            model_name='bronzeeventdata',
            name='source_name',
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='app_name',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='category',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='function',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='line_number',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='message_id',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='proc_id',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='source',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bronzeeventdata',
            name='version_info',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='account_name',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='account_type',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='channel',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='domain',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='event_id',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='event_received_time',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='event_time',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='event_type',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='hostname',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='keywords',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='message',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='opcode',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='opcode_value',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='provider_guid',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='record_number',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='task',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='thread_id',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='bronzeeventdata',
            name='user_id',
            field=models.CharField(max_length=50, null=True),
        ),
    ]