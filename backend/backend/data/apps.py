from django.apps import AppConfig


class DataConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.data'
    label = 'data'  # This is optional but helpful

