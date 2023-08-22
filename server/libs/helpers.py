import os

from django.conf import settings
from django.contrib.sites.models import Site


def get_site_url():
    """Returns the complete url of the current site."""
    protocol = "https" if settings.HTTPS_ENABLED else "http"
    return "%s://%s" % (protocol, Site.objects.get_current().domain)


def get_web_url():
    """Returns the complete url of the current site."""
    return settings.APPLICATION_URL

def get_static_url():
    if settings.ENV_MODE == 'local':
        return get_site_url() + settings.STATIC_URL

    return settings.STATIC_URL
