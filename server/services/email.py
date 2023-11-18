from typing import Union

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from libs.helpers import get_static_url, get_web_url


def send_email(
    *,
    to: Union[list[str], str],
    from_email: str = settings.DEFAULT_FROM_EMAIL,
    template: str,
    subject="",
    context=None,
    attachments=None
):
    context = context or {}
    context.update({
        "STATIC_URL": get_static_url(),
        "web_url": get_web_url(),
    })
    to = [to] if isinstance(to, str) else to
    message = render_to_string(template, context).strip()

    email = EmailMultiAlternatives(
        subject=subject,
        from_email=from_email,
        to=to
    )
    email.attach_alternative(message, "text/html")

    if attachments:
        for file_path in attachments:
            email.attach_file(file_path)

    email.send()
