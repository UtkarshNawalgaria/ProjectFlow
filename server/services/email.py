from typing import Union

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

from libs.helpers import get_static_url, get_web_url


def send_email(
    *,
    to: Union[list[str], str],
    from_email: str = settings.DEFAULT_FROM_EMAIL,
    message_str="",
    template: str = None,
    subject="",
    context=None
):
    html_message = None
    context = context or {}
    context.update({
        "STATIC_URL": get_static_url(),
        "web_url": get_web_url(),
    })

    if template:
        html_message = render_to_string(template, context).strip()

    if isinstance(to, str):
        to = [to]

    send_mail(
        subject=subject, message=message_str, from_email=from_email,
        recipient_list=to, html_message=html_message
    )
