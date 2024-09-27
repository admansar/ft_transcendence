import json
from channels.generic.websocket import AsyncWebsocketConsumer

players: list = []
ids: int = 0

class GameConsumer(AsyncWebsocketConsumer):
    user_name: str = "none"
    opp_id: int = 0
    is_connected: bool = False
    id: int = 0
    room_id: int = 0
    first: bool = False
    data: dict = {}

    async def connect(self):
        global ids
        user = self.scope["user"]
        if user.is_authenticated:
            self.user_name = user.username
            print(f"connected user : {self.user_name}")
            self.id = ids
            self.first = True if self.id % 2 == 0 else False
            self.opp_id = self.id + 1 if self.first else self.id - 1
            self.room_id = int(self.id / 2)
            self.is_connected = True
            # for player in players:
            #     if self.user_name in player.user_name:
            #         self = player
            #         break
            #  else:
            ids += 1
        else:
            print ("user not auth")
            return
        await self.accept()
        players.append(self)
        await self.send(json.dumps({
            'type': 'init_state',
            'game_state': {
                'player_name': self.user_name,
                'player_count' : ids,
                'player_id' : self.id,
                'opp_player_name': players[self.opp_id].user_name if not self.first and self.opp_id < len(players) else 'waiting...',
            }
        }))
        await self.update_game_states()

    async def disconnect(self, close_code):
        self.is_connected = False

    async def receive(self, text_data: json):
        tmp_data = json.loads(text_data)
        for k, v in tmp_data.items():
            self.data[k] = v
        print (f"received data from id {self.id}: {self.data}")
        message_stat = self.data.get('type')
        if not self.first and message_stat == 'joined_game':
            players[self.id].data["type"] = 'start_game'
            players[self.opp_id].data["type"] = 'start_game'
            await players[self.opp_id].send (json.dumps(players[self.opp_id].data))
            await players[self.id].send (json.dumps(players[self.id].data))
        if message_stat == 'move':
            players[self.opp_id].data["type"] = 'move'
            players[self.opp_id].data["position"] = self.data["position"]
            players[self.opp_id].data["id"] = self.data["id"]
            players[self.opp_id].data["is_right"] = self.data["is_right"]
            players[self.opp_id].data["is_left"] = self.data["is_left"]
            await players[self.opp_id].send (json.dumps(players[self.opp_id].data))

    async def update_game_states(self) -> None:
        self.data: dict = {
            'type': 'init_game',
            'room_id': self.room_id,
            'id': self.id,
        }
        print ("id :", self.id)
        print ("is_first", self.first)
        if self.first:
            players[self.id].data["player"] = players[self.id].user_name
            players[self.id].data["opp_player"] = "waiting..."
        else:
            players[self.id].data["player"] = players[self.id].user_name
            players[self.id].data["opp_player"] = players[self.opp_id].user_name
            players[self.opp_id].data["opp_player"] = players[self.id].data["player"]
            players[self.opp_id].data["player"] = players[self.id].data["opp_player"]
        # print (players[self.id].data)
        # if not self.first:
        #     print (players[self.opp_id].data)
        if not self.first:
            await players[self.opp_id].send (json.dumps(players[self.opp_id].data))
        await players[self.id].send (json.dumps(players[self.id].data))
    


# connected_players: dict = {
#     'player1': None,
#     'player2': None,
# }


# class GameConsumer(AsyncWebsocketConsumer):
#     game_lock: bool = False
#     user_name: str = "no name"
#     role: str = "no role"

#     async def connect(self):
#         user = self.scope["user"]
#         if user.is_authenticated:
#             self.user_name = user.username
#             print(f"Connected user: {self.user_name}")
#         else:
#             print("User not authenticated")
#         await self.accept()

#         if connected_players['player1'] is None:
#             connected_players['player1'] = self
#             self.role = self.user_name
#         elif connected_players['player2'] is None:
#             connected_players['player2'] = self
#             self.role = self.user_name
#         else:
#             await self.close()
#             return

#         await self.send(json.dumps({
#             'type': 'initial_state',
#             'game_state': {
#                 'player_name': self.user_name,
#                 'player1_name': connected_players['player1'].user_name if connected_players['player1'] else 'Waiting...',
#                 'player2_name': connected_players['player2'].user_name if connected_players['player2'] else 'Waiting...',
#                 'player_count': sum(1 for p in connected_players.values() if p is not None),
#             }
#         }))
#         await self.broadcast_game_state()

#     async def disconnect(self, close_code):
#         if connected_players['player1'] == self:
#             connected_players['player1'] = None
#         elif connected_players['player2'] == self:
#             connected_players['player2'] = None
#         await self.broadcast_game_state()

#     async def receive(self, text_data: json):
#         data = json.loads(text_data)
#         message_type = data.get('type')

#         if message_type == 'join_game':
#             await self.broadcast_game_state()
#         if message_type == 'bounce':
#             await self.bounce(data)
#         elif message_type == 'pause' or message_type == 'resume':
#             await self.broadcast_game_pause_or_resume(message_type)
#         elif message_type == 'move':
#             await self.broadcast_game_moves(data)
#         elif not self.game_lock and sum(1 for p in connected_players.values() if p is not None) == 2 and message_type == 'start_game':
#             print("Game is full")
#             await self.broadcast_game_start()
#         elif message_type == 'score':
#             await self.broadcast_update_score(data)

#     async def broadcast_game_state(self) -> None:
#         game_state: dict = {
#             'type': 'game_state',
#             'player_name': self.role,
#             'player1_name': connected_players['player1'].user_name if connected_players['player1'] else 'Waiting...',
#             'player2_name': connected_players['player2'].user_name if connected_players['player2'] else 'Waiting...',
#             'player_count': sum(1 for p in connected_players.values() if p is not None),
#         }
#         for player in connected_players.values():
#             if player is not None:
#                 await player.send(json.dumps(game_state))

#     async def broadcast_game_start(self) -> None:
#         game_start: dict = {
#             'type': 'game_start',
#             'player_name': self.role,
#             'player1_name': connected_players['player1'].user_name if connected_players['player1'] else 'Waiting...',
#             'player2_name': connected_players['player2'].user_name if connected_players['player2'] else 'Waiting...',
#             'player_count': sum(1 for p in connected_players.values() if p is not None),
#         }
#         for player in connected_players.values():
#             if player is not None:
#                 await player.send(json.dumps(game_start))

#     async def broadcast_game_moves(self, data: dict[str, str]) -> None:
#         game_moves: dict = {
#             'type': 'moves',
#             'position': data['position'],
#             'id': data['id'],
#             'is_right': data['is_right'],
#             'is_left': data['is_left'],
#         }

#         for player in connected_players.values():
#             if player is not None:
#                 await player.send(json.dumps(game_moves))

#     async def broadcast_game_pause_or_resume(self, message_type: str):
#         game_pause_or_resume: dict = {
#             'type': message_type,
#             'player_name': self.role,
#         }
#         for player in connected_players.values():
#             if player is not None:
#                 await player.send(json.dumps(game_pause_or_resume))

#     async def bounce(self, data: dict[str, str]) -> None:
#         game_bounce: dict = {k: data[k] for k in data.keys()}
#         for player in connected_players.values():
#             if player is not None:
#                 await player.send(json.dumps(game_bounce))

#     async def broadcast_update_score(self, data: dict[str, str]) -> None:
#         game_bounce: dict = {k: data[k] for k in data.keys()}
#         for player in connected_players.values():
#             if player is not None:
#                 await player.send(json.dumps(game_bounce))
    
    
