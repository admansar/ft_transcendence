from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from accounts.models import User
from django.shortcuts import get_object_or_404
from game.models import GameScore
from django.db.models import Q

class CompleteGame(APIView):
    def post(self, request):
        print('COMPLETEEE', request.data)
        game = get_object_or_404(GameScore, id=request.data.get('game_id'))
        game.status = 'Completed'
        game.save()
        return Response({'message': 'Game completed successfully'})

class initGame(APIView):
    def post(self, request):       
        player = get_object_or_404(User, username=request.data.get('self_name'))
        opponent = get_object_or_404(User, username=request.data.get('other_name'))
                
        if player.username > opponent.username:
            player, opponent = opponent, player
            
        game = GameScore.objects.create(player_a=player,
                                        player_b=opponent,
                                        score_a=0,
                                        score_b=0,
                                        status='In progress'
                                        )
        existing_game = GameScore.objects.filter(
            player_a=player,
            player_b=opponent,
            status='In progress'
        ).first()
        
        if existing_game:
            print('existing_game', existing_game.id, existing_game.player_a, existing_game.player_b)
            return Response({
                'game_id': existing_game.id,
                'player_a': existing_game.player_a.first_name,
                'player_b': existing_game.player_b.first_name,
                'status': 'In progress',
                })
        else:
            print('game', game.id, game.player_a, game.player_b)
        return Response({'game_id': game.id, 'player_a': player.first_name, 'player_b': opponent.first_name})
    
class UpdateScore(APIView):
    def post(self, request):
        print('Score UPPPDATe', request.data)
        # player = get_object_or_404(User, username=request.data.get('username'))
        game = get_object_or_404(GameScore, id=request.data.get('game_id'))
        if request.data.get('username') == game.player_a.username:
            game.score_a = request.data.get('score')
        else:
            game.score_b = request.data.get('score')
        game.save()
        print('game', game.id, game.player_a, game.player_b, game.score_a, game.score_b)
        return Response({'updateScore': request.data})

class GetGame(APIView):
    def post(self, request):
        print('gamesssss', request.data)
        username = get_object_or_404(User, username=request.data.get('username'))
        games = GameScore.objects.filter(
            Q(player_a=username) | Q(player_b=username),
            status='Completed'
        ).order_by('-date')[:3]
        games = games.values()
        print('games', games)
        try:
            player_a = get_object_or_404(User, id=games[0]['player_a_id'])
            print('player_a.first_name', player_a.first_name)
            player_b = get_object_or_404(User, id=games[0]['player_b_id'])
            
            
            avatar_a = player_a.avatar
            avatar_b = player_b.avatar
        except Exception as e:
            print('No games found')
            return Response({'message': 'No games found'})
        
        for game in games:
            game['avatar_a'] = avatar_a
            game['avatar_b'] = avatar_b
        
        return Response({'message': 'Games fetched successfully', 'games': games})

# @login_required
# def game_2d(request):
#     return render(request, 'game.html')


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def select_game(request):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    return Response({"message": f"Welcome, {request.user.username}"}, status=200)
    # return render(request, 'select_game.html')

# @login_required
# def game_3d(request):
#     return render(request, "game_3d.html")

# @login_required
# def game_2d_off(request):
#     return render(request, 'offline_2dgame.html')

# @login_required
# def tournament(request):
#     return render(request, 'tournament.html')