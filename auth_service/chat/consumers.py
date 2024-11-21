import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.utils.html import strip_tags
import redis
import django
django.setup()
from .models import Client
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from authentication_service.models import User


@database_sync_to_async
def get_user_from_token(token):
    jwt = JWTAuthentication()
    validated_token = jwt.get_validated_token(token)
    _user = jwt.get_user(validated_token)
    return _user

class ChatConsumer(AsyncWebsocketConsumer):
    client = Client.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    redis_client = None
    async def trough_channel(self, channel_name, text_data):
        channel_layer = get_channel_layer()
        await channel_layer.send(channel_name, { 
                "type": "send.message",
                "text": text_data["message"],
                "user": text_data["sender"],
            })
        
    @database_sync_to_async
    def Backup_message_or_send(self, text_data, my_client : Client): # backup message if ther user offline and send message if the user online 
        redis_client = (redis.Redis)(host='redis', port=6379, db=1)
        text_data["sender"] = self.scope["user"].username
        if my_client != None:
            if my_client.status == "offline":
                resiver = text_data["user"]
                index = (redis_client.incr)('index') # generate index on redis
                (redis_client.hset)(f'{resiver}:{index}' , mapping=text_data)
            else:
                return "send"
    @database_sync_to_async
    def Creat_client(self):
        self.redis_client = (redis.Redis)(host='redis', port=6379, db=1)
        data = (self.redis_client.keys)("*")
        user = []
        for i in range(len(data)):
            user.append(data[i].decode('utf-8'))
        if (self.client.filter(username=self.scope["user"].username).exists)(): # if user is alredy have a client model will delete it and creat new channel with online status 
            (self.client.filter(username=self.scope["user"].username).delete)()
            (self.client.create)(username=self.scope["user"].username,\
                channel_name=self.channel_name, status="online")
        else:
            (self.client.create)(username=self.scope["user"].username,
                    channel_name=self.channel_name, status="online")
        return user
    
    @database_sync_to_async
    def Parse_messgae_on_redis(self, key):
        user : str = key[0: key.find(":")] # see if the use have a backup message in redis server and parsing it 
        if self.scope["user"].username == user:
            data = (self.redis_client.hgetall)(key)
            data = (list)(data.items())
            data = [[item.decode('utf-8') for item in sublist] for sublist in data]
            data = {key: value for key, value in data}
            json_string = (json.dumps)(data)
            json_string = (json.loads)(json_string)
            (self.redis_client.delete)(key)
            return json_string
            
    async def connect(self):
        try:
            cookies = self.scope['cookies']
            _user = await get_user_from_token(cookies['access'])
            self.scope["user"] = _user
            user = await self.Creat_client()
            for key in user:
                json_string = await self.Parse_messgae_on_redis(key)
                if (json_string != None):
                    await self.trough_channel(self.channel_name, json_string)
        except Exception:
            await self.close(code=1008)
        await self.accept()

    async def receive(self, text_data):
        text_data = await sync_to_async(json.loads)(text_data)
        try:
            my_client : Client = await sync_to_async(self.client.get)(username=text_data["user"])
        except Exception:
            return None
        status : str = await self.Backup_message_or_send(text_data, my_client)
        if status == "send":
            await self.trough_channel(my_client.channel_name, text_data)

    @database_sync_to_async
    def disconnect(self, event):
        try:
            my_client = self.client.get(username=self.scope["user"].username)
            my_client.update_status("offline")
            my_client.save()
        except Exception:
            return None


    async def send_message(self, event):
        await self.send(json.dumps({
            'message': (event["text"]),
            'user': (event["user"]),
        }))