import json
from channels.generic.websocket import AsyncWebsocketConsumer

players = []


class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.group_name = 'tournament'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        players.append(self)
        # print (self.user.username, ' connected')
        for player in players:
            player.broadcast_usernames()
        if len(players) == 4:
            print ('Game started')
            pass
                
        # Code to handle connection
        pass

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
