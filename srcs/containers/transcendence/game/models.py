from django.db import models


class GameScore(models.Model):
    player_name = models.CharField(max_length=100)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)