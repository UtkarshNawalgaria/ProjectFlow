# Generated by Django 4.1.3 on 2022-11-15 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="verification_code",
            field=models.CharField(
                blank=True, max_length=256, verbose_name="account verification code"
            ),
        ),
    ]