import json
from channels.generic.websocket import AsyncWebsocketConsumer

players = []


class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if "=" in self.scope['query_string'].decode():
            self.token = self.scope['query_string'].decode().split('=')[1]
            print (f"Token : {self.token}")
            user = await self.authenticate_user(self.token)
            print (f"User : {user}")
            if user is not None:
                self.user = user
            else:
                await self.close()
                return
        else:
            self.user = self.scope['user']
            if not self.user.is_authenticated:
                await self.close()
                return
        
        self.room_id = await self.assign_room(self.user['username'])
        self.group_name = f'tour_room{self.room_id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        players.append(self)
        print (self.user.username, ' connected')
        for player in players:
            player.broadcast_usernames()
        if len(players) == 4:
            print ('Game started')
        else:
            print (f'number of online players is : {len(players)}')
                
        # Code to handle connection
        pass
    
            
    async def authenticate_user(self, token):
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            print  (f"Payload : {payload}")
            return payload
        except Exception as e:
            print (f"Error in authenticate_user : {e}")
            return None


    async def broadcast_usernames(self):
        print ('Broadcasting usernames')
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_usernames',
                'usernames': [player.user.username for player in players]
            }
        )
        
    async def send_usernames(self, event):
        print (event['usernames'])
        await self.send(text_data=json.dumps({
            'usernames': event['usernames']
        }))
        
    async def start_game(self, event):
        pass

    async def disconnect(self, close_code):
        # Code to handle disconnection
        pass

    async def receive(self, text_data):
        # Code to handle received data
        pass

    async def send_message(self, message):
        # Code to send message to client
        pass
