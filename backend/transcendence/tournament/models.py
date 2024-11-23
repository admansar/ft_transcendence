from django.db import models
import requests

class Tournament(models.Model):
    winner_id = models.IntegerField(null=True)
    status = models.CharField(max_length=20, default='In progress', null=True)
    date = models.DateTimeField(auto_now_add=True)
    
    def get_winner(self):
        response = requests.get(f'http://auth:3000/api/auth/user/id/{self.winner_id}/')
        if response.status_code == 200:
            return response.json()
        else:
            return None