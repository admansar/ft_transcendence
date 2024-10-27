from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView

# @login_required
# def game_2d(request):
#     return render(request, 'game.html')


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def select_game(request):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    print('Here', request.user.username)


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