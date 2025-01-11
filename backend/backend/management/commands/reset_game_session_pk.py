from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Resets the primary key sequence for the game_session table.'

    def handle(self, *args, **kwargs):
        self.reset_primary_key_sequence_to_max('game_gamesession', 'id')

    def reset_primary_key_sequence(self, table_name, pk_name):
        """Resets the primary key sequence for a given table."""
        with connection.cursor() as cursor:
            sequence_name = f"{table_name}_{pk_name}_seq"
            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', '{pk_name}'), 1, false);")
            self.stdout.write(self.style.SUCCESS(f"PK sequence for table '{table_name}' has been reset."))

    def reset_primary_key_sequence_to_max(self, table_name, pk_name):
        """Resets the primary key sequence to the maximum value of the primary key column."""
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', '{pk_name}'), (SELECT COALESCE(MAX({pk_name}), 1) FROM {table_name}), true);")
            self.stdout.write(self.style.SUCCESS(f"PK sequence for table '{table_name}' has been set to the max value."))
