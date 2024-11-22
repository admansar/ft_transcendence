from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from authentication_service.models import User
from django.contrib.auth import authenticate, login
from django.contrib import messages 
from .models import Profile, friend_request
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import Serializer_User, SerializerProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.utils.decorators import method_decorator 
from django.db.models import Q
import json
from rest_framework_simplejwt.authentication import JWTAuthentication

def get_user_from_token(request):
    token = request.COOKIES.get('access')
    jwt = JWTAuthentication()
    validated_token = jwt.get_validated_token(token)
    _user = jwt.get_user(validated_token)
    return _user


def Unblock_user(P_user : Profile ,s_user : User ,s_user_id : int):
    if P_user.block.filter(id=s_user_id):
        P_user.block.remove(s_user)

def Accept_method(sender : friend_request):
    sender.status = True
    sender.save()


def Reject_method(P_user : Profile, s_user_id : int, s_user : User):
    if P_user.waiting.filter(id=s_user_id).exists():
        P_user.waiting.remove(s_user)

def Block_user(user ,P_user : Profile, s_user_id : int,  s_user : User):
    profile = Profile.objects.all()
    user_P : Profile = profile.get(user=s_user)
    if user_P.friends.filter(id=user.id).exists():
      user_P.friends.remove(user)
    if P_user.friends.filter(id=s_user_id).exists():
       P_user.friends.remove(s_user)
    elif P_user.waiting.filter(id=s_user_id).exists():
        P_user.waiting.remove(s_user)
    P_user.block.add(s_user)

def Unfriend(P_user : Profile , s_user_id : int, s_user : User, _user : User):
    profile = Profile.objects.all()
    user_P : Profile = profile.get(user=s_user)
    if P_user.friends.filter(id=s_user_id).exists():
        P_user.friends.remove(s_user)
    if user_P.friends.filter(id=_user.id).exists():
        user_P.friends.remove(_user)

def Createfriend_rolation(friend_reciver : User, user_P : Profile, resiver_user_P : Profile, _user):
    if not user_P.block.filter(id=friend_reciver.id).exists():
        if not resiver_user_P.block.filter(id=_user.id).exists():
            if not user_P.friends.filter(id=friend_reciver.id).exists():
                if not user_P.waiting.filter(id=friend_reciver.id).exists():
                    if not resiver_user_P.waiting.filter(id=_user.id).exists():
                        friend = friend_request.objects.create(sender=_user, reciver=friend_reciver)
                        friend.save()
                        return Response({"message" : " request send . "})
                    else:
                        return Response({"error" : " You have allredy sent request wait for response. "})
                else:
                    return Response({"error" : " This User Alrady Invite You And Waiting Your Confirm. "})
            else:
                return Response({"error" : " Already Have This User As Friend. "})
        else:
            return Response({"error" : " You Get Blocked From This User. "})
    else:
        return Response({"error" : " You Can't add This User. "})

def  ADD_method(_user, _reciver_id):
    user = User.objects.all()
    profile = Profile.objects.all()
    if user.filter(id=_reciver_id).exists():
        friend_reciver : User = user.get(id=_reciver_id)
        user_P : Profile = profile.get(user=_user)
        resiver_user_P : Profile = profile.get(user=friend_reciver)
        return Createfriend_rolation(friend_reciver, user_P, resiver_user_P, _user)
    else:
        return Response({"error" : " Invalid username. "})

class Userprofile(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = Profile.objects.all()
        _user = get_user_from_token(request)
        userprofile = profile.get(user=_user)
        Serializer = SerializerProfile(userprofile)
        return Response({"Profile" : Serializer.data})

class Search(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        user = User.objects.all()
        _username_or_email = request.data.get("user_or_email")
        if user.filter(Q (username__startswith=_username_or_email) | Q (email=_username_or_email)):
            theuser = user.filter(Q (username__startswith=_username_or_email) | Q (email=_username_or_email))
            serializer = Serializer_User(theuser, many=True)
            return Response(serializer.data)
        else:
            return Response({"error" : " User not fond ."})

class Request_methods(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        user = User.objects.all()
        profile = Profile.objects.all()
        request_friend = friend_request.objects.all()
        _user = get_user_from_token(request)
        status = request.data.get("status") 
        _reciver : str = request.data.get('user_id')
        P_user : Profile = profile.get(user=_user)
        # mydata = SerializerProfile(P_user)
        if status == "ADD":
            return ADD_method(_user, _reciver)
        elif status == "REJECT" or status == "BLOCK" or status == "ACCEPT" \
                or status == "UNBLOCK" or status == "UNFRIEND":
            s_user_id : str = request.data.get('user_id')
            s_user : User = user.get(id=s_user_id)
            sender = None
            if request_friend.filter(sender=s_user, reciver=_user).exists():
                sender : friend_request = request_friend.get(sender=s_user, reciver=_user)
            if status == "ACCEPT":
                Accept_method(sender)
            elif status == "REJECT":
                Reject_method(P_user, s_user_id, s_user)
            elif status == "BLOCK":
                Block_user(_user, P_user, s_user_id, s_user)
            elif status == "UNBLOCK":
                Unblock_user(P_user, s_user, s_user_id)
            elif status == "UNFRIEND":
                Unfriend(P_user, s_user_id, s_user, _user)
            if sender != None:
                sender.delete()
        P_user.save()
        return Response()