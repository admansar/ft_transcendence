# Generated by Django 4.2.16 on 2024-09-25 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_remove_user_name_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(default='Anonymous', max_length=255, unique=True),
        ),
    ]
