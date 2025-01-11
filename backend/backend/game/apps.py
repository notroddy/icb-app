from django.apps import AppConfig


class GameConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.game'
    label = 'game'  # This is optional but helpful
