# Generated by Django 5.1.4 on 2025-01-11 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='loop',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]