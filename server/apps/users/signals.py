from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def send_account_activation_email(sender, instance, created, *args, **kwargs):
    if not created:
        return

    send_mail(
        "Account Activation", "Please activate your account", None, [instance.email]
    )
    print(f"Send account activation email to {instance.email}")
