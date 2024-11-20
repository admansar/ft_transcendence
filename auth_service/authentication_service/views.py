from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
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
from django.conf import settings
import os
from friends.models import Profile


User = get_user_model()

class OTP:
    def __init__(self):
        self.otp = ""

    def generate_otp(self):
        self.otp = ''.join(secrets.choice(string.digits) for _ in range(6))
        return self.otp

    def verify_otp(self, user_otp):
        return self.otp == user_otp
class GenerateOTPView(APIView):
    def post(self, request):
        to_email = request.data.get('email')
        
        if not to_email:
            return Response(
                {"error": "Email is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            otp_handler = OTP()
            otp = otp_handler.generate_otp()

            subject = "Unlock Your Adventure! Here's Your OTP"
            message = f'Your OTP is: {otp}'
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [to_email]
            
            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False,
            )
            request.session['otp'] = otp
            request.session['otp_email'] = to_email
            
            return Response(
                {"message": "OTP sent successfully"}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred while sending the email. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class VerifyOTPView(APIView):
    def post(self, request):
        user_otp = request.data.get('otp')
        user_email = request.data.get('email')
        
        stored_otp = request.session.get('otp')
        stored_email = request.session.get('otp_email')
        
        if not user_otp or not user_email:
            return Response(
                {"error": "OTP and email are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if user_email != stored_email:
            return Response(
                {"error": "Email does not match"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if user_otp != stored_otp:
            return Response(
                {"error": "Invalid OTP"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Clear the OTP from session after successful verification
        del request.session['otp']
        del request.session['otp_email']
        
        return Response(
            {"message": "OTP verified successfully"}, 
            status=status.HTTP_200_OK
        )

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
        _user = User.objects.get(id=serializer.data["id"])
        Profile.objects.create(user=_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class Login(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        user = User.objects.filter(Q(username=username) | Q(email=email)).first()
        if user is None or not user.check_password(password):
            return Response({'error': 'Incorrect username or password'}, status=status.HTTP_404_NOT_FOUND)

        try:
            refresh = RefreshToken.for_user(user)
        except Exception as e:
            print ("Error: ", e)
            print ("lets make a migration using os.system")
            try:
                os.system ('python3 manage.py migrate')
                refresh = RefreshToken.for_user(user)
            except Exception as e:
                print ("Error: ", e)
                return Response({'error': 'Error while generating token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        access = refresh.access_token
        response = Response()
        response.data = {
            'access': str(access),
            'refresh': str(refresh)
        }
        response.set_cookie(key='access', value=str(access), httponly=True)
        response.set_cookie(key='refresh', value=str(refresh), httponly=True)
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
    # def post(self, request):
    #     try:
    #         username_or_email = request.data.get('username_or_email')
    #         if not username_or_email:
    #             return Response({"error": "Username or email is required"}, status=400)
    #         if '@' in username_or_email:
    #             user = User.objects.get(email=username_or_email)
    #         else:
    #             user = User.objects.get(username=username_or_email)
    #         serializer = UserSerializer(user)

        
class GetAllUsers(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class Me(APIView):
    def post(self, request):
        token = request.COOKIES.get('access')
        if not token:
            raise AuthenticationFailed('Unauthorized')
        
        id = JWTAuthentication().get_validated_token(token).get('user_id')
        return Response({'access': token, 'id': id})

class Logout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

class UpdateUser(APIView):
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]
    def put(self,request):
        print('request.data', request.data)
        token = request.COOKIES.get('access')
        print(token)
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            jwt = JWTAuthentication()
            validated_token = jwt.get_validated_token(token)
            user = jwt.get_user(validated_token)
            print('user', user)
        except Exception as e:
            print('Error:', e)
            return Response({'error': 'Invalid token or user not found'}, status=401)
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
            