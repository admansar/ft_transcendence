from django.shortcuts import render
from rest_framework.views import APIView
from friends_game.services import get_all_users
from rest_framework.response import Response
import requests

class RankUser(APIView):
    username = None
    win = 0
    loss = 0
    def get(self, request):
        result = []
        _user = get_all_users()
        for key in _user:
            user = key["username"]
            response = requests.post('http://localhost:8000/api/game/get-games',
                json = {"username" : user},
                headers = {"Content-Type": "application/json"},)
            data = response.json()
            if data['message'] == "No games found":
               result.append({
                    "username" : user,
                    "win" : 0,
                    "loss" : 0,
               })
            else:
                for key in data['games']:
                    usera = key["player_a_id"]
                    userb = key['player_b_id']
                    if key["player_a"] == user:
                        if (usera > userb):
                            self.win += 1
                        else:
                            self.loss += 1
                    if key["player_b"] == user:
                        if (userb > usera):
                            self.win += 1
                        else:
                            self.loss += 1
                temp = {
                    "username" : user,
                    "win" : self.win,
                    "loss" : self.loss,
                }
                result.append(temp)
            self.loss = 0
            self.win = 0
        return  Response(result)
# Create your views here.
