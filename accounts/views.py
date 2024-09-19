# api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid credentials!"}, status=status.HTTP_401_UNAUTHORIZED)
