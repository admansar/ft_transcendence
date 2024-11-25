from django.shortcuts import render
from rest_framework.views import APIView
from friends_game.services import get_all_users
from rest_framework.response import Response
import requests

class RankUser(APIView):
    def get(self, request):
        _user = get_all_users()
        user = _user[0]["username"]
        response = requests.get(f'http://localhost:8000/api/game/get-games{user}/')
        return Response(response)

# Create your views here.
