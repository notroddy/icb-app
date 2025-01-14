from django.core.management.base import BaseCommand
from django.db import connection
from backend.game.models import Game, GameSession, Loop, Hole
from backend.data.models import Player, Country, State, City, Team, Arcade

class Command(BaseCommand):
    help = 'Reset primary keys for all tables'

    def handle(self, *args, **kwargs):
        models = [Game, GameSession, Loop, Hole, Player, Country, State, City, Team, Arcade]
        with connection.cursor() as cursor:
            for model in models:
                table_name = model._meta.db_table
                if model == Player:
                    sequence_name = f"{table_name}_user_ptr_seq"
                    cursor.execute(f"CREATE SEQUENCE IF NOT EXISTS {sequence_name} OWNED BY {table_name}.user_ptr_id;")
                    cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', 'user_ptr_id'), coalesce(max(user_ptr_id), 1), max(user_ptr_id) IS NOT null) FROM {table_name};")
                else:
                    sequence_name = f"{table_name}_id_seq"
                    cursor.execute(f"CREATE SEQUENCE IF NOT EXISTS {sequence_name} OWNED BY {table_name}.id;")
                    cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM {table_name};")
        self.stdout.write(self.style.SUCCESS('Successfully reset primary keys for all tables'))
