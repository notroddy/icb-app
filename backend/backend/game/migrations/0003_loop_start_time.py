# Generated by Django 5.1.4 on 2025-01-11 21:55

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_loop_end_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='loop',
            name='start_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
