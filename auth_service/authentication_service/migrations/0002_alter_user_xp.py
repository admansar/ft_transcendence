# Generated by Django 4.2.16 on 2024-11-27 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication_service', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='xp',
            field=models.IntegerField(default=15),
        ),
    ]
