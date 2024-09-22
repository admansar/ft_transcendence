from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token


@api_view(['POST'])
def signup(request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username=serializer.data['username'])
            token = Token.objects.get(user=user)
            serializer = UserSerializer(user)
            data = {
                 "user" : serializer.data,
                "token" : token.key
            }
            return Response(data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    return Response({"message" : "login page"})

@api_view(['GET'])
def TestView(request):
    return Response({"message" : "Test page"})

@api_view(['POST'])
def logout(request):
    return Response({"message" : "logout page"})
