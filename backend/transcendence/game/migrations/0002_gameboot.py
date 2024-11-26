# Generated by Django 4.2.3 on 2024-11-25 23:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameBoot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=100)),
                ('type', models.CharField(max_length=1)),
                ('isWinner', models.BooleanField()),
                ('userScore', models.IntegerField()),
                ('botScore', models.IntegerField()),
            ],
        ),
    ]