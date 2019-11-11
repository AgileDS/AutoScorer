from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ApiConfig(AppConfig):
    name = 'api'
    verbose_name = _('api')

    def ready(self):
        try:
            import brainy_rats_app.api.signals  # noqa F401
        except ImportError:
            pass
