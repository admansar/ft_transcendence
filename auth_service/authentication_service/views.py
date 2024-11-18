from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import HttpResponseRedirect
import requests
from django.shortcuts import redirect
import pyotp
from django.shortcuts import get_object_or_404


User = get_user_model()

class GenerateOTPView(APIView):
    def get(self, request):
        """
        Génère un OTP et le renvoie.
        """
        SECRET_KEY = "JBSWY3DPEHPK3PXP"  # Exemple de clé secrète
        totp = pyotp.TOTP(SECRET_KEY)
        otp = totp.now()  # Génère un OTP valide
        return Response({"otp": otp, "message": "OTP généré avec succès"}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    def post(self, request):
        """
        Vérifie le OTP envoyé par l'utilisateur.
        """
        SECRET_KEY = "JBSWY3DPEHPK3PXP"  # Clé secrète utilisée pour vérifier le OTP
        user_otp = request.data.get("otp")  # Récupérer le OTP envoyé
        totp = pyotp.TOTP(SECRET_KEY)
        
        if totp.verify(user_otp):  # Vérifier si le OTP est valide
            return Response({"message": "OTP validé avec succès"}, status=status.HTTP_200_OK)
        return Response({"message": "OTP invalide ou expiré"}, status=status.HTTP_400_BAD_REQUEST)

class Oauth42(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            raise AuthenticationFailed('No code provided')

        api_url = 'https://api.intra.42.fr/oauth/token'
        redirect_uri = 'http://localhost:8000/api/accounts/oauth42/'

        # Step 1: Get the access token
        try:
            response_token = requests.post(api_url, data={
                'code': code,
                'client_id': 'u-s4t2ud-2a476d713b4fc0ea1dfd09f1c6a9204cd6a43dc0c9a6a976d2ed239addacd68b',
                'client_secret': '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',
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            })
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(f'Error fetching token: {str(e)}')

        if response_token.status_code != 200:
            raise AuthenticationFailed('Invalid token response from 42 API')

        access_token = response_token.json().get('access_token')

        if not access_token:
            raise AuthenticationFailed('No access token received')

        # Step 2: Use the access token to get user info
        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        try:
            response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        except requests.exceptions.RequetException as e:
            raise AuthenticationFailed(f'Error fetching user info: {str(e)}')

        if response.status_code != 200:
            raise AuthenticationFailed('Failed to fetch user information')

        user_info = response.json()
        print('user_info', user_info)
        user, created = User.objects.get_or_create(
            email=user_info.get('email', ''),  # Use email instead of username
            defaults={
                'username': user_info['login'],  # If you still need a username, set it here
                'first_name': user_info.get('first_name', ''),
                'last_name': user_info.get('last_name', ''),
                'is_active': True,
                'is_staff': False,
                'is_superuser': False,
                'avatar': user_info.get('image', {}).get('link', ''),
            }
        )
        if created:
            user.save()
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        response = HttpResponseRedirect("http://localhost/")
        response.data = {
            'access': str(access),
            'refresh': str(refresh)
        }
        response.set_cookie(key='access', value=str(access))
        response.set_cookie(key='refresh', value=str(refresh))
        return response 


class SignUp(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class Login(APIView):
    def post(self, request):
        # print('request.data', request.data)
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        user = User.objects.filter(Q(username=username) | Q(email=email)).first()
        if user is None or not user.check_password(password):
            return Response({'error': 'Incorrect username or password'}, status=status.HTTP_404_NOT_FOUND)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        response = Response()
        response.data = {
            'access': str(access),
            'refresh': str(refresh)
        }
        response.set_cookie(key='access', value=str(access), httponly=True)#, samesite='None', secure=False)
        response.set_cookie(key='refresh', value=str(refresh), httponly=True)#, samesite='None', secure=False)
        return response
    
class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh')
        if refresh_token is None:
            raise AuthenticationFailed('No refresh token was found!')
        
        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = refresh.access_token
        except Exception as e:
            raise AuthenticationFailed('Invalid or expired token!')
        
        response = Response({
            'message': 'Token refreshed successfully'
        })
        response.set_cookie(key='access', value=str(new_access_token), httponly=True)
        response.set_cookie(key='refresh', value=str(refresh), httponly=True)
        return response

class UserView(APIView):
    def get(self, request, username=None, id=None):
        try:
            if username:
                user = User.objects.get(username=username)
            else:
                user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
    def post(self, request):
        try:
            username = request.data.get('username')
            user = get_object_or_404(User, username=username)
            print('User is =>', user)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=401)

class Me(APIView):
    def post(self, request):
        token = request.COOKIES.get('access')
        print('token', token)
        # v = JWTAuthentication().get_validated_token(token)
        # print('valid token', v)
        if not token:
            raise AuthenticationFailed('Unauthorized')
        
        return Response({'access': token})

class Logout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
    
class UpdateUser(APIView):
    def put(self,request):
        token = request.COOKIES.get('jwt')
        print(token)
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)