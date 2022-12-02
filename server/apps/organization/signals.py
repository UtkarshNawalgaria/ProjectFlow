from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

from .models import Organization, OrganizationUsers

User = get_user_model()


@receiver(post_save, sender=User)
def create_organization_on_user_signup(sender, instance, created, *args, **kwargs):
    """
    Create a new `Organization` object for a newly created user.
    """

    if not created:
        return

    title = instance.email.split("@")[0]
    organization_name = f"Organization {title}"

    organization = Organization.objects.create(title=organization_name)
    OrganizationUsers.objects.create(organization=organization, user=instance)
