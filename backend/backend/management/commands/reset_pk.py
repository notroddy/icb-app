from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps

class Command(BaseCommand):
    help = 'Resets the primary key sequences for all models in specified apps.'

    def handle(self, *args, **kwargs):
        # Define the apps where you want to reset PK sequences
        apps_to_reset = ['data', 'game']

        for app_name in apps_to_reset:
            app_config = apps.get_app_config(app_name)
            models = app_config.get_models()

            for model in models:
                model_name = model._meta.model_name
                table_name = model._meta.db_table
                pk_name = model._meta.pk.name
                self.reset_primary_key_sequence(table_name, pk_name)
                self.reset_primary_key_sequence_to_max(table_name, pk_name)

    def reset_primary_key_sequence(self, table_name, pk_name):
        """Resets the primary key sequence for a given table."""
        with connection.cursor() as cursor:
            sequence_name = f"{table_name}_{pk_name}_seq"
            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', '{pk_name}'), 1, false);")
            self.stdout.write(self.style.SUCCESS(f"PK sequence for table '{table_name}' has been reset."))

    def reset_primary_key_sequence_to_max(self, table_name, pk_name):
        """Resets the primary key sequence to the maximum value of the primary key column."""
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', '{pk_name}'), (SELECT MAX({pk_name}) FROM {table_name}), true);")
            self.stdout.write(self.style.SUCCESS(f"PK sequence for table '{table_name}' has been set to the max value."))

