from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Checks the current maximum value of the id column and the current value of the sequence for the game_session table.'

    def handle(self, *args, **kwargs):
        self.check_primary_key_sequence('game_gamesession', 'id')

    def check_primary_key_sequence(self, table_name, pk_name):
        """Checks the current maximum value of the primary key column and the current value of the sequence."""
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT MAX({pk_name}) FROM {table_name};")
            max_id = cursor.fetchone()[0]
            cursor.execute(f"SELECT last_value FROM {table_name}_{pk_name}_seq;")
            last_value = cursor.fetchone()[0]
            self.stdout.write(self.style.SUCCESS(f"Max {pk_name} in table '{table_name}': {max_id}"))
            self.stdout.write(self.style.SUCCESS(f"Current sequence value for '{table_name}_{pk_name}_seq': {last_value}"))
