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
        # print('Heeere', request.data)
        # return Response({'data': request.data})
        player = request.data.get('self_name')
        opponent = request.data.get('other_name')
        
        player = get_object_or_404(User, username=player)
        opponent = get_object_or_404(User, username=opponent)
        
        if player.username > opponent.username:
            player, opponent = opponent, player
            
        existing_game = GameScore.objects.filter(
            player_a=player.first_name,
            player_b=opponent.first_name,
            status='In progress'
        ).first()
        
        if existing_game:
            print('existing_game', existing_game.id, existing_game.player_a, existing_game.player_b)
            return Response({
                'game_id': existing_game.id,
                'player_a': existing_game.player_a,
                'player_b': existing_game.player_b,
                })
        else:    
            game = GameScore.objects.create(player_a=player.first_name,
                                            player_b=opponent.first_name,
                                            score_a=0,
                                            score_b=0,
                                            status='In progress'
                                            )
            print('game', game.id, game.player_a, game.player_b)
            return Response({'game_id': game.id, 'player_a': game.player_a, 'player_b': game.player_b})
    
class UpdateScore(APIView):
    def post(self, request):
        print('Score UPPPDATe', request.data)
        return Response({'updateScore': request.data})

class GetGame(APIView):
    def post(self, request):
        print('gamesssss', request.data)
        username = request.data.get('username')
        games = GameScore.objects.filter(
            Q(player_a=username) | Q(player_b=username),
            status='Completed'
        ).order_by('-date')[:3]
        print('games', games)
        games = games.values()
        try:
            player_a = get_object_or_404(User, username=games[0]['player_a'])
            player_b = get_object_or_404(User, username=games[0]['player_b'])
            
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