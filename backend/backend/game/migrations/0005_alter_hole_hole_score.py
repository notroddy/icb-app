# Generated by Django 5.1.4 on 2025-01-12 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_hole_end_time_hole_start_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hole',
            name='hole_score',
            field=models.IntegerField(default=0),
        ),
    ]
