from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
import logging

logger = logging.getLogger('accounts')

@receiver(post_save, sender=User)
def log_user_save(sender, instance, created, **kwargs):
    if created:
        logger.debug(f"New user created: {instance.email}")
    else:
        logger.debug(f"User updated: {instance.email}")
        
@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    logger.debug(f'User {user.email} logged in')

@receiver(user_logged_out)
def user_logged_out_callback(sender, request, user, **kwargs):
    if user:
        logger.debug(f'User {user.email} logged out')

@receiver(user_login_failed)
def user_login_failed_callback(sender, credentials, **kwargs):
    logger.debug(f'Login failed for: {credentials.get("email", "unknown")}')
