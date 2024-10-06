import logging

logger = logging.getLogger('accounts')

class LoggingMixin:
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        if hasattr(self, 'action'):
            logger.debug(f"{self.action.capitalize()} action performed on {self.__class__.__name__} by user {request.user.email}")
        return response