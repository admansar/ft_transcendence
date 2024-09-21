from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer
from django.http import HttpResponse

class RegisterView(APIView):
    def post(self,request):
        return HttpResponse('Hello, World!')
        # serializer = UserSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        # serializer.save()
        # return Response(serializer.data)
    # khassni nhacher password hanaya 

class LoginView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]

                # class signupView(APIView):
    # def post(self, request):
    #     username = request.data.get("username")
    #     password = request.data.get("password")

    #     user = authenticate(request, username=username, password=password)
    #     if user is not None:

    #         return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
    #     else:
    #         return Response({"message": "Invalid credentials!"}, status=status.HTTP_401_UNAUTHORIZED)
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test(request):
    return Response("from test")

