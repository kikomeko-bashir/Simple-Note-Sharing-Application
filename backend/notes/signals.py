from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserProfile


User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance: User, created: bool, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, name=getattr(instance, 'first_name', '') or instance.username)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance: User, **kwargs):
    # Ensure the profile exists; creates if missing
    UserProfile.objects.get_or_create(user=instance)

