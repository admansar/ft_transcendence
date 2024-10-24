# game.consumers

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import asyncio
import time
from typing import Any
import jwt
from accounts.models import User


# Constants
CANVAS_WIDTH: int = 1000
CANVAS_HEIGHT: int = 800
BALL_RADIUS: int = 15
RACKET_WIDTH: float = 20
RACKET_HEIGHT: float = 140
INITIAL_BALL_SPEED: int = 20
MAX_SCORE: int = 5
GAME_TICK_RATE: int = 30  # fps
RACKET_POS: float = 50
RACKET_SPEED: float = 20

# In-memory storage for game rooms
# For scalability, consider using Redis or a database
game_rooms: dict = {}

class GameState:
    def __init__(self, room_id: int) -> None:
        self.room_id:int = room_id
        self.ball_pos: dict[str:int] = {'x': CANVAS_WIDTH / 2, 'y': CANVAS_HEIGHT / 2}
        self.ball_dir: dict[str:int] = {'x': 1, 'y': 0}  # Direction vector
        self.ball_speed: int = INITIAL_BALL_SPEED
        self.racket_speed: int = RACKET_SPEED
        self.racket1_pos: dict[str:int] = {'x': RACKET_POS, 'y': CANVAS_HEIGHT / 2 - RACKET_HEIGHT / 2}
        self.racket2_pos: dict[str:int] = {'x': CANVAS_WIDTH - RACKET_POS - RACKET_WIDTH, 'y': CANVAS_HEIGHT / 2 - RACKET_HEIGHT / 2}
        self.score1: int = 0
        self.score2: int = 0
        self.players: list = []  # List of connected players
        self.game_loop_task = None
        self.start_time: float = None
        
    def start_game(self) -> None:
        self.start_time = time.time()

    def get_elapsed_time(self) -> int:
        if self.start_time is None:
            return 0
        return int(time.time() - self.start_time)


    def reset_ball(self, direction :str = 'left') -> None:
        self.ball_pos = {'x': CANVAS_WIDTH / 2, 'y': CANVAS_HEIGHT / 2}
        self.ball_dir = {'x': -1 if direction == 'left' else 1, 'y': 0}
        self.ball_speed = INITIAL_BALL_SPEED

    def check_collision_with_racket(self) -> None:
        if (self.racket1_pos['x'] <= self.ball_pos['x'] - BALL_RADIUS <= self.racket1_pos['x'] + RACKET_WIDTH):
            if (self.racket1_pos['y'] <= self.ball_pos['y'] <= self.racket1_pos['y'] + RACKET_HEIGHT):
                self.ball_dir['x'] *= -1
                delta_y = self.ball_pos['y'] - (self.racket1_pos['y'] + RACKET_HEIGHT / 2)
                self.ball_dir['y'] = delta_y / (RACKET_HEIGHT / 2)
                self.normalize_ball_dir()
        if (self.racket2_pos['x'] <= self.ball_pos['x'] + BALL_RADIUS <= self.racket2_pos['x'] + RACKET_WIDTH):
            if (self.racket2_pos['y'] <= self.ball_pos['y'] <= self.racket2_pos['y'] + RACKET_HEIGHT):
                self.ball_dir['x'] *= -1
                delta_y = self.ball_pos['y'] - (self.racket2_pos['y'] + RACKET_HEIGHT / 2)
                if delta_y == 0:
                    delta_y = 0.01
                self.ball_dir['y'] = delta_y / (RACKET_HEIGHT / 2)
                self.normalize_ball_dir()

    def normalize_ball_dir(self) -> None:
        # Ensure the direction vector has a magnitude of 1
        magnitude = (self.ball_dir['x'] ** 2 + self.ball_dir['y'] ** 2) ** 0.5
        if magnitude != 0:
            self.ball_dir['x'] /= magnitude
            self.ball_dir['y'] /= magnitude
            

class GameRoom:
    def __init__(self, room_id: int) -> None:
        self.room_id: int = room_id
        self.players: list = []
        self.game_state: GameState = GameState(room_id)
        self.game_loop_task = None


class GameConsumer(AsyncWebsocketConsumer):
    room_group_name: str = "room_01" # default room
    room_id: int = 1 # default room
    room: GameRoom = None
    user: User | dict = None

    async def connect(self,) -> None:
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
        if isinstance(self.user, User):
            self.room_id = await self.assign_room(self.user.username)
        elif isinstance(self.user, dict):
            self.room_id = await self.assign_room(self.user['username'])
        self.room_group_name = f'room_{self.room_id}'
        print (f"creating room : {self.room_group_name}")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()
        await self.send_init_state()
        self.room = game_rooms[self.room_id]
        if len(self.room.players) == 2 and not self.room.game_loop_task:
            other_player = self.room.players[0] if self.room.players[1] == self else self.room.players[1]
            await other_player.send_player_info(self.user['username'])
            await self.start_countdown(other_player)
            self.room.game_state.start_game()
            self.room.game_loop_task = asyncio.create_task(self.game_loop())
        
        
    async def authenticate_user(self, token):
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            print  (f"Payload : {payload}")
            return payload
        except Exception as e:
            print (f"Error in authenticate_user : {e}")
            return None


    async def send_player_info(self, opponent: str) -> None:
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_info',
                'opponent': opponent
            }
        )
        
    async def player_info(self, event: Any) -> None:
        opponent = event['opponent']
        await self.send(text_data=json.dumps({
            'type': 'player_info',
            'opponent': opponent
        }))
    async def start_countdown(self, other) -> None:
        data: dict = {
                    'type': 'countdown',
                    'countdown': ""
                }
        changes: list = [n for n in range(3, 0, -1)]
        for change in changes:
            data['countdown'] = change
            await self.send(text_data=json.dumps(data))
            await other.send(text_data=json.dumps(data))
            await asyncio.sleep(1)


    async def disconnect(self, data) -> None:
        try:
            # Leave the room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

            # Remove player from room
            self.room = game_rooms.get(self.room_id)
            if self.room:
                self.room.players = [p for p in self.room.players if p.channel_name != self.channel_name]
                # Notify the other player
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'player_disconnected',
                        'message': f'{self.user['username']} has disconnected.'
                    }
                )
                # cancel game loop
                if self.room.game_loop_task:
                    self.room.game_loop_task.cancel()
                    self.room.game_loop_task = None
                # If no players left, delete the room
                if not self.room.players:
                    del game_rooms[self.room_id]
        except Exception as e:
            print (f"Error in disconnect : {e}")
            pass

    async def receive(self, text_data: Any) -> None:
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'player_move':
            await self.update_paddles_position(data)
            tmp = data.get('player_id')
            if tmp == 1:
                self.room.game_state.racket1_pos = data.get('racket1_pos') 
            else:
                self.room.game_state.racket2_pos = data.get('racket2_pos')

    async def update_paddles_position(self, data: dict[str, Any]) -> None:
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'moves',
                'racket1_pos': data.get('racket1_pos'),
                'racket2_pos': data.get('racket2_pos')
            }
        )
        
    async def moves(self, event: Any) -> None:
        racket1_pos = event['racket1_pos']
        racket2_pos = event['racket2_pos']
        await self.send(text_data=json.dumps({
            'type': 'moves',
            'racket1_pos': racket1_pos,
            'racket2_pos': racket2_pos
        }))


    async def send_init_state(self) -> None:
        self.room = game_rooms.get(self.room_id)
        if not self.room:
            return

        game_state = {
            'type': 'init_state',
            'game_state': {
                'player_id': self.room.players.index(self) + 1,
                'room_id': self.room_id,
                'room_name': self.room_group_name,
                'ball_speed': self.room.game_state.ball_speed,
                'racket1_pos': self.room.game_state.racket1_pos,
                'racket2_pos': self.room.game_state.racket2_pos,
                'ball_pos': self.room.game_state.ball_pos,
                'score1': self.room.game_state.score1,
                'score2': self.room.game_state.score2,
                'player': self.room.players[0].user['username'],
                'opponent': self.room.players[1].user['username'] if len(self.room.players) > 1 else 'waiting...',
                'direction': self.room.game_state.ball_dir,
                'racket_speed': self.room.game_state.racket_speed,
                'racket_width': RACKET_WIDTH,
                'racket_height': RACKET_HEIGHT,
                'canvas_width': CANVAS_WIDTH,
                'canvas_height': CANVAS_HEIGHT,
            }
        }

        await self.send(text_data=json.dumps(game_state))

    async def send_game_state(self, state: dict) -> None:
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'state': state,
            'direction': self.room.game_state.ball_dir,
            'ball_speed': self.room.game_state.ball_speed,
        }))
        

    async def player_disconnected(self, event:  Any) -> None:
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'message': message,
        }))

    async def game_loop(self) -> None:
        try:
            while True:
                await asyncio.sleep(1 / GAME_TICK_RATE)
                self.update_game_state(self.room.game_state)
                elapsed_time = self.room.game_state.get_elapsed_time()
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'broadcast_game_state',
                        'state': {
                            'ball_pos': self.room.game_state.ball_pos,
                            'racket1_pos': self.room.game_state.racket1_pos,
                            'racket2_pos': self.room.game_state.racket2_pos,
                            'score1': self.room.game_state.score1,
                            'score2': self.room.game_state.score2,
                            'elapsed_time': elapsed_time,
                            'fps': GAME_TICK_RATE
                            }
                    }
                )
        except asyncio.CancelledError:
            pass



    def update_game_state(self, game_state: GameState) -> None:
        # Update ball position
        game_state.ball_pos['x'] += game_state.ball_dir['x'] * game_state.ball_speed
        game_state.ball_pos['y'] += game_state.ball_dir['y'] * game_state.ball_speed

        # Check for collisions with top and bottom walls
        if game_state.ball_pos['y'] - BALL_RADIUS < 0:  # Collision with top wall
            game_state.ball_pos['y'] = (BALL_RADIUS) # Reset position to avoid overlap
            game_state.ball_dir['y'] *= -1  # Reverse direction

        elif game_state.ball_pos['y'] + BALL_RADIUS > CANVAS_HEIGHT:  # Collision with bottom wall
            game_state.ball_pos['y'] = CANVAS_HEIGHT - (BALL_RADIUS)  # Reset position to avoid overlap
            game_state.ball_dir['y'] *= -1  # Reverse direction

        # elif game_state.ball_pos['y'] - BALL_RADIUS < 0 or game_state.ball_pos['y'] + BALL_RADIUS > CANVAS_HEIGHT:
        #     game_state.ball_dir['y'] *= -1

        # Check for collisions with rackets
        game_state.check_collision_with_racket()

        # Check for scoring
        if game_state.ball_pos['x'] - BALL_RADIUS <= 0:
            game_state.score2 += 1
            game_state.reset_ball(direction='left')
        elif game_state.ball_pos['x'] + BALL_RADIUS >= CANVAS_WIDTH:
            game_state.score1 += 1
            game_state.reset_ball(direction='right')

        # Check for game over
        if game_state.score1 >= MAX_SCORE or game_state.score2 >= MAX_SCORE:
            # Handle game over logic here (e.g., reset game, notify players)
            game_state.reset_ball()
            game_state.score1 = 0
            game_state.score2 = 0
            # Notify players about game over
            asyncio.create_task(self.notify_game_over())

    def serialize_game_state(self, game_state: GameState) -> dict:
        return {
            'ball_pos': game_state.ball_pos,
            'racket1_pos': game_state.racket1_pos,
            'racket2_pos': game_state.racket2_pos,
            'score1': game_state.score1,
            'score2': game_state.score2
        }

    async def broadcast_game_state(self, event):
        state = event['state']
        await self.send_game_state(state)

    async def notify_game_over(self):
        self.room = game_rooms.get(self.room_id)
        if not self.room:
            return
        for player in self.room.players:
            print (f"player : {player.user}")
        winner = self.room.players[0].user['username'] if self.room.game_state.score1 >= MAX_SCORE else self.room.players[1].user['username']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_over',
                'winner': winner
            }
            # GameScore.winner
        )

    async def game_over(self, event: Any) -> None:
        winner = event['winner']
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'winner': winner
        }))

    @database_sync_to_async
    def assign_room(self, username: str) -> int:
        # Assign the player to an existing room with less than 2 players
        for room_id, self.room in game_rooms.items():
            if len(self.room.players) < 2:
                self.room.players.append(self)
                return room_id
        # Create a new room
        new_room_id = len(game_rooms)
        game_rooms[new_room_id] = GameRoom(room_id=new_room_id)
        game_rooms[new_room_id].players.append(self)
        return new_room_id
