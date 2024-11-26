from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
# from accounts.models import User
from django.shortcuts import get_object_or_404
from .models import GameScore
from django.db.models import Q
from operator import itemgetter
from .services import (
    get_user_from_api,
    get_user_from_api_by_id,
    get_all_users
)
from rest_framework import status
import requests
class CompleteGame(APIView):
    def post(self, request):
        print('COMPLETEEE', request.data)
        game = get_object_or_404(GameScore, id=request.data.get('game_id'))
        game.status = 'Completed'
        game.save()
        return Response({'message': 'Game completed successfully'})

class initGame(APIView):
    def post(self, request):       
        # player = get_object_or_404(User, username=request.data.get('self_name'))
        # opponent = get_object_or_404(User, username=request.data.get('other_name'))

        player = get_user_from_api(request.data.get('self_name'))
        opponent = get_user_from_api(request.data.get('other_name'))
        
        if player.get('username') > opponent.get('username'):
            player, opponent = opponent, player
            
        game = GameScore.objects.create(player_a_id=player['id'],
                                        player_b_id=opponent['id'],
                                        score_a=0,
                                        score_b=0,
                                        status='In progress'
                                        )
        existing_game = GameScore.objects.filter(
            player_a_id=player['id'],
            player_b_id=opponent['id'],
            status='In progress'
        ).first()
        
        if existing_game:
            print('existing_game', existing_game.id, existing_game.player_a_id, existing_game.player_b_id)
            return Response({
                'game_id': existing_game.id,
                'player_a': player['first_name'],
                'player_b': opponent['first_name'],
                'status': 'In progress',
                })
        else:
            print('game', game.id, game.player_a_id, game.player_b_player_a_id)
        return Response({'game_id': game.id, 'player_a': player.first_name, 'player_b': opponent.first_name})
    
class UpdateScore(APIView):
    def post(self, request):
        print('Score UPPPDATe', request.data)
        # player = get_object_or_404(User, username=request.data.get('username'))
        game = get_object_or_404(GameScore, id=request.data.get('game_id'))
        player = get_user_from_api(request.data.get('username'))
        
        if game.player_a_id == player['id']:
            game.score_a = request.data.get('score')
        else:
            game.score_b = request.data.get('score')
            
        game.save()
        print('game', game.id, game.player_a_id, game.player_b_id)
        return Response({'updateScore': request.data})

class GetGame(APIView):
    def post(self, request):
        print('gamesssss', request.data)
        # username = get_object_or_404(User, username=request.data.get('username'))
        print('request.data.get(username)', request.data.get('username'))
        username = get_user_from_api(request.data.get('username'))
        print('username ===>', username)
        games = GameScore.objects.filter(
            # Q(player_a=username) | Q(player_b=username),
            Q(player_a_id=username['id']) | Q(player_b_id=username['id']),
            status='Completed'
        ).order_by('-date')[:len(GameScore.objects.all())]
        games = games.values()
        print('games', games)
        try:
            # player_a = get_object_or_404(User, id=games[0]['player_a_id'])
            print('player_a.first_name', games[0]['player_a_id'])
            player_a = get_user_from_api_by_id(games[0]['player_a_id'])
            # player_b = get_object_or_404(User, id=games[0]['player_b_id'])
            player_b = get_user_from_api_by_id(games[0]['player_b_id'])
                        
            avatar_a = player_a.get('avatar')
            avatar_b = player_b.get('avatar')
        except Exception as e:
            print('No games found')
            return Response({'message': 'No games found'})
        
        for game in games:
            game['avatar_a'] = avatar_a
            game['avatar_b'] = avatar_b
            game['player_a'] = player_a.get('first_name')
            game['player_b'] = player_b.get('first_name')
        
        return Response({'message': 'Games fetched successfully', 'games': games})

class RankUser(APIView):
    username = None
    win = 0
    loss = 0
    def get(self, request):
        result = []
        _user = get_all_users()
        for key in _user:
            score = 0
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
                    "score" : 0,
                    "achivements" : 0
               })
            else:
                for key in data['games']:
                    usera = key["score_a"]
                    userb = key['score_b']
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
                score = self.win - self.loss
                if score * 8 >= 0:
                    score = score * 8
                else:
                    score = 0
                temp = {
                    "username" : user,
                    "win" : self.win,
                    "loss" : self.loss,
                    "score" : score,
                    "achivements" : self.win
                }
                result.append(temp)
            self.loss = 0
            self.win = 0
        sort_result = sorted(result, key=itemgetter('score'), reverse=True)
        return  Response(sort_result)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def select_game(request):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    return Response({"message": f"Welcome, {request.user.username}"}, status=200)
