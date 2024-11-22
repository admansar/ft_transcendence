# Generated by Django 4.2.3 on 2024-11-22 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('friends_game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_a_id', models.IntegerField(null=True)),
                ('player_b_id', models.IntegerField(null=True)),
                ('score_a', models.IntegerField(null=True)),
                ('score_b', models.IntegerField(null=True)),
                ('status', models.CharField(default='In progress', max_length=20, null=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.DeleteModel(
            name='GameRoom',
        ),
    ]