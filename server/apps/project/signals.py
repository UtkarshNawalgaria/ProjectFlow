from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone

from services.email import send_email

from .models import FileExport


@receiver(post_save, sender=FileExport)
def send_export_tasks_email(
    sender: FileExport, instance: FileExport, created: bool, **kwargs
):
    if not created:
        return

    context = {"name": instance.exported_by.name, "download_link": instance.file.url}

    try:
        send_email(
            to=[instance.exported_by.email],
            template="email/projects/task-exports.html",
            subject="Exported Tasks",
            context=context,
            attachments=[instance.file.path],
        )
        instance.email_sent_at = timezone.now()
        instance.save(update_fields=["email_sent_at"])
    except Exception as e:
        pass
