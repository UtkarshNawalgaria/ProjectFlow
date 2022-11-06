from pathlib import Path
from typing import Any, Dict, List
from pydantic import EmailStr, BaseModel

from jinja2 import Environment, PackageLoader, select_autoescape
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from config import get_settings

settings = get_settings()


class EmailSchema(BaseModel):
    email: List[EmailStr]


config = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_USERNAME,
    MAIL_PASSWORD=settings.EMAIL_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_PORT=settings.EMAIL_PORT,
    MAIL_SERVER=settings.EMAIL_SERVER,
    MAIL_FROM_NAME="Tasks Manager",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=settings.EMAIL_USE_CREDENTIALS,
    VALIDATE_CERTS=False,
)

env = Environment(
    loader=PackageLoader("main", "templates"), autoescape=select_autoescape(["html"])
)


async def send_email(
    template_file: Path,
    subject: str,
    recipients: List[EmailStr],
    cc: List[EmailStr] = [],
    context: Dict[str, Any] = {},
):
    template = env.get_template(f"email/{template_file}")
    html = template.render(context)

    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        cc=cc,
        body=html,
        subtype=MessageType.html,
    )

    mail = FastMail(config)
    await mail.send_message(message)
