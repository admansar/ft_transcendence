from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt

# @login_required
# def game_2d(request):
#     return render(request, 'game.html')

@api_view(['GET'])
def select_game(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        raise AuthenticationFailed('Authentication credentials were not provided.')

    token = auth_header.split(' ')[1]  # Extract token from header

    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired.')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token.')

    return Response({"message": f"Welcome, {payload['username']}"}, status=200)  # Set the response status explicitly
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