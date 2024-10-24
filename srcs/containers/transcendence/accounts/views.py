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
import requests

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
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(f'Error fetching user info: {str(e)}')

        if response.status_code != 200:
            raise AuthenticationFailed('Failed to fetch user information')

        user_info = response.json()
        payload = {
            'id': user_info['id'],
            'username': user_info['login'],
            'email': user_info['email']
        }
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        print(token)
        decode = jwt.decode(token, 'secret', algorithms=['HS256'])
        print(decode)
        # decode = jwt.decode(token, 'secret', algorithms=['HS256'])
        user_profile , created  = User.objects.get_or_create(username=decode['username'], email=decode['email'])
        print(user_profile)
        if created:
            user_profile.save()
        
    # ow i save in database after decode 
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response

class SignUp(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

User = get_user_model()

class Login(APIView):
    def post(self, request):
        print('Herre')
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        user = User.objects.filter(Q(username=username) | Q(email=email)).first()
        if user is None:
            raise AuthenticationFailed('User not found')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        # payload = {
        #     'id': user.id,
        #     'username': user.username,
        #     'email': user.email
        # }
        # token = jwt.encode(payload, 'secret', algorithm='HS256')
        # response.set_cookie(key='jwt', value=token, httponly=True)
        # response.data = {
        #     'jwt': token
        # }
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        response = Response()
        response.data = {
            'access': str(access),
            'refresh': str(refresh)
        }
        return response

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
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