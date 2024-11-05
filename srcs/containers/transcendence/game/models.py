from django.db import models


class GameScore(models.Model):
    player_a = models.CharField(max_length=30, null=True)
    player_b = models.CharField(max_length=30, null=True)
    score_a = models.IntegerField(null=True)
    score_b = models.IntegerField(null=True)
    status = models.CharField(max_length=20, default='In progress', null=True)
    date = models.DateTimeField(auto_now_add=True)
