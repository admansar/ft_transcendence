import json
from channels.generic.websocket import AsyncWebsocketConsumer

connected_players : dict = {
    'player1': None,
    'player2': None,
}


class GameConsumer(AsyncWebsocketConsumer):
    game_lock : bool = False
    user_name : str = "no name"
    role : str = "no role"

    async def connect(self):
        user = self.scope["user"]
        if user.is_authenticated:
            self.user_name = user.username
            print(f"Connected user: {self.user_name}")
        else:
            print("User not authenticated")
        await self.accept()

        if connected_players['player1'] is None:
            connected_players['player1'] = self
            self.role = self.user_name
        elif connected_players['player2'] is None:
            connected_players['player2'] = self
            self.role = self.user_name
        else:
            await self.close()
            return

        await self.send(json.dumps({
            'type': 'initial_state',
            'game_state': {
                'player_name': self.user_name,
                'player1_name': connected_players['player1'].user_name if connected_players['player1'] else 'Waiting...',
                'player2_name': connected_players['player2'].user_name if connected_players['player2'] else 'Waiting...',
                'player_count': sum(1 for p in connected_players.values() if p is not None),
            }
        }))
        await self.broadcast_game_state()

    async def disconnect(self, close_code):
        if connected_players['player1'] == self:
            connected_players['player1'] = None
        elif connected_players['player2'] == self:
            connected_players['player2'] = None
        await self.broadcast_game_state()

    async def receive(self, text_data : json):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'join_game':
            await self.broadcast_game_state()
        elif message_type == 'pause' or  message_type == 'resume':
            await self.broadcast_game_pause_or_resume(message_type)
        elif message_type == 'move':
            await self.broadcast_game_moves(data)
        elif not self.game_lock and sum(1 for p in connected_players.values() if p is not None) == 2 and message_type == 'start_game':
            print("Game is full")
            await self.broadcast_game_start()

    async def broadcast_game_state(self) -> None:
        game_state : dict = {
            'type': 'game_state',
            'player_name': self.role,
            'player1_name': connected_players['player1'].user_name if connected_players['player1'] else 'Waiting...',
            'player2_name': connected_players['player2'].user_name if connected_players['player2'] else 'Waiting...',
            'player_count': sum(1 for p in connected_players.values() if p is not None),
        }
        for player in connected_players.values():
            if player is not None:
                await player.send(json.dumps(game_state))

    async def broadcast_game_start(self) -> None:
        game_start : dict = {
            'type': 'game_start',
            'player_name': self.role,
            'player1_name': connected_players['player1'].user_name if connected_players['player1'] else 'Waiting...',
            'player2_name': connected_players['player2'].user_name if connected_players['player2'] else 'Waiting...',
            'player_count': sum(1 for p in connected_players.values() if p is not None),
        }
        for player in connected_players.values():
            if player is not None:
                await player.send(json.dumps(game_start))

    async def broadcast_game_moves(self, data : dict[str, str]) -> None:
        game_moves  : dict = {
            'type': 'moves',
            'position': data['position'],
            'id': data['id'],
            'is_right': data['is_right'],
            'is_left': data['is_left'],
        }

        for player in connected_players.values():
            if player is not None:
                await player.send(json.dumps(game_moves))
                
        
    async def broadcast_game_pause_or_resume(self, message_type : str):
        game_pause_or_resume : dict = {
            'type': message_type,
            'player_name': self.role,
        }

        for player in connected_players.values():
            if player is not None:
                await player.send(json.dumps(game_pause_or_resume))
