# Generated by Django 4.2.3 on 2024-10-24 01:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='num_losses',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='num_wins',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='score',
            field=models.SmallIntegerField(null=True),
        ),
    ]