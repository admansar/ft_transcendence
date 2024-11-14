from django.db import models
from accounts.models import User

class GameScore(models.Model):
    player_a = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player_a', null=True)
    player_b = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player_b', null=True)
    score_a = models.IntegerField(null=True)
    score_b = models.IntegerField(null=True)
    status = models.CharField(max_length=20, default='In progress', null=True)
    date = models.DateTimeField(auto_now_add=True)
