# Generated by Django 4.1.3 on 2023-04-16 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0005_alter_projectusers_options_alter_tasklist_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='priority',
            field=models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='low', max_length=10, null=True, verbose_name='Task Priority'),
        ),
    ]
