import json
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from game.consumers import GameRoom
from game.consumers import GameConsumer

players = []
game_rooms = {}
winners = []  # List to store winners for the next round

class TournamentConsumer(AsyncWebsocketConsumer):
    player_num = 4  # Total number of players in the tournament
    match_size = 2  # Each match is a 1v1

    async def connect(self):
        # Authenticate and connect user
        user = await self.authenticate_user(self.scope['query_string'].decode().split('=')[1])
        if not user:
            await self.close()
            return
        self.user = user

        # Check if the user is already connected
       #  for player in players:
       #      if player.user['username'] == self.user['username']:
       #          print (f'{self.user["username"]} is already connected')
       #          await self.disconnect(1000)
       #          await self.close()
       #          return

        # Assign the player to a game room for 1v1 matches
        self.room_id = await self.assign_room(self.user['username'])
        await self.accept()
        print (f'{self.user["username"]} connected')
        players.append(self)

        # Notify all players about the updated usernames
        for player in players:
            await player.broadcast_usernames()

        # Start the game if enough players are in the room
        if len(players) == self.player_num:  # self.player_num:
            for player in players:
                await player.start_match()

        elif len(players) > self.player_num:
            pass  # Handle overflow later

    async def start_match(self):
        print('Starting 1v1 match')
        await self.send(text_data=json.dumps({'type': 'start_game'}))

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Assuming the client sends the match result (e.g., who won)
        if data['type'] == 'match_result':
            await self.handle_match_result(data['winner'])

    async def handle_match_result(self, winner):
        # Store the winner
        winners.append(winner)

        # Remove the room from the active game rooms
        for room_id, room in game_rooms.items():
            if self in room.players:
                del game_rooms[room_id]

        # Check if it's time to start the next round
        if len(winners) == len(players) // 2:
            await self.start_next_round()

        elif len(winners) == 1 and len(players) == 2:  # Final match
            await self.declare_winner(winners[0])

    async def start_next_round(self):
        global players
        players = []  # Reset the players list for the next round

        # Re-assign players for the next round
        for winner in winners:
            self.user = winner
            await self.connect()  # Re-add winners for the next round

        # Reset winners for the next round
        winners.clear()

    async def declare_winner(self, champion):
        # Send a final message to all players with the winner
        for player in players:
            await player.send(text_data=json.dumps({
                'type': 'final_winner',
                'winner': champion
            }))

    async def disconnect(self, close_code):
        # Handle disconnect
        if self in players:
            players.remove(self)
        print (f'{self.user["username"]} disconnected')
#        if close_code == 1000:
#            await self.send(text_data=json.dumps({'type': 'error', 'message': self.user['username'] + ' is already connected'}))

        # Notify all players about the updated usernames
        for player in players:
            await player.broadcast_usernames()

    async def authenticate_user(self, token):
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            return payload
        except Exception as e:
            return None

    async def broadcast_usernames(self):
        usernames = [p.user['username'] for p in players]
        # Directly send usernames to each player
        for player in players:
            await player.send(text_data=json.dumps({'type': 'usernames', 'usernames': usernames, 'player_num': self.player_num}))

    @database_sync_to_async
    def assign_room(self, username):
        # Assign to a room with space or create a new one
        for room_id, room in game_rooms.items():
            if len(room.players) < self.match_size:
                room.players.append(self)
                return room_id

        # Create a new room if no space in current rooms
        new_room_id = len(game_rooms)
        game_rooms[new_room_id] = GameRoom(room_id=new_room_id)
        game_rooms[new_room_id].players.append(self)
        return new_room_id


class TournamentGameConsumer(GameConsumer, AsyncWebsocketConsumer):
    room_group_name: str = "tour_game"
    room_id: int = 0
    room: GameRoom = None
    user: dict = {}
    
    async def connect(self):
        await GameConsumer.connect(self)

    async def disconnect(self, close_code):
        await GameConsumer.disconnect(self, close_code)
        
    async def receive(self, text_data):
        await GameConsumer.receive(self, text_data)
        
    async def broadcast(self, event):
        await GameConsumer.broadcast(self, event)
