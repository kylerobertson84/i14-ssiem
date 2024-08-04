# Generated by Django 4.2.14 on 2024-08-04 11:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('logs', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='IncidentReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('type', models.CharField(max_length=20)),
                ('status', models.CharField(choices=[('ongoing', 'Ongoing'), ('closed', 'Closed')], max_length=10)),
                ('rules', models.TextField()),
                ('description', models.TextField()),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='logs.bronzeeventdata')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]