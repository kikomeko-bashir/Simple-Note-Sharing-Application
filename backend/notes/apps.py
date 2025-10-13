from django.apps import AppConfig


class NotesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notes'

    def ready(self) -> None:
        # Import signals to ensure they are registered
        from . import signals  # noqa: F401
        return super().ready()