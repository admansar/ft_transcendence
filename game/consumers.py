# your_game_app/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import asyncio
import time

# Constants
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
BALL_RADIUS = 15
RACKET_WIDTH = 20
RACKET_HEIGHT = 140
INITIAL_BALL_SPEED = 10
MAX_SCORE = 5000
GAME_TICK_RATE = 60  # Updates per second
RACKET_POS = 50

# In-memory storage for game rooms
# For scalability, consider using Redis or a database
game_rooms = {}

class GameState:
    def __init__(self, room_id):
        self.room_id = room_id
        self.ball_pos = {'x': CANVAS_WIDTH / 2, 'y': CANVAS_HEIGHT / 2}
        self.ball_dir = {'x': 1, 'y': 0}  # Direction vector
        self.ball_speed = INITIAL_BALL_SPEED
        self.racket1_pos = {'x': RACKET_POS, 'y': CANVAS_HEIGHT / 2 - RACKET_HEIGHT / 2}
        self.racket2_pos = {'x': CANVAS_WIDTH - RACKET_POS - RACKET_WIDTH, 'y': CANVAS_HEIGHT / 2 - RACKET_HEIGHT / 2}
        self.score1 = 0
        self.score2 = 0
        self.players = []  # List of connected players
        self.game_loop_task = None
        self.start_time = None
        
    def start_game(self):
        self.start_time = time.time()

    def get_elapsed_time(self):
        if self.start_time is None:
            return 0
        return int(time.time() - self.start_time)


    def reset_ball(self, direction='left'):
        self.ball_pos = {'x': CANVAS_WIDTH / 2, 'y': CANVAS_HEIGHT / 2}
        self.ball_dir = {'x': -1 if direction == 'left' else 1, 'y': 0}
        self.ball_speed = INITIAL_BALL_SPEED

    def check_collision_with_racket(self):
        # Collision with racket1
        if (self.racket1_pos['x'] <= self.ball_pos['x'] - BALL_RADIUS <= self.racket1_pos['x'] + RACKET_WIDTH):
            if (self.racket1_pos['y'] <= self.ball_pos['y'] <= self.racket1_pos['y'] + RACKET_HEIGHT):
                self.ball_dir['x'] *= -1
                # Adjust ball direction based on where it hits the racket
                delta_y = self.ball_pos['y'] - (self.racket1_pos['y'] + RACKET_HEIGHT / 2)
                self.ball_dir['y'] = delta_y / (RACKET_HEIGHT / 2)
                self.normalize_ball_dir()
        
        # Collision with racket2
        if (self.racket2_pos['x'] <= self.ball_pos['x'] + BALL_RADIUS <= self.racket2_pos['x'] + RACKET_WIDTH):
            if (self.racket2_pos['y'] <= self.ball_pos['y'] <= self.racket2_pos['y'] + RACKET_HEIGHT):
                self.ball_dir['x'] *= -1
                # Adjust ball direction based on where it hits the racket
                delta_y = self.ball_pos['y'] - (self.racket2_pos['y'] + RACKET_HEIGHT / 2)
                self.ball_dir['y'] = delta_y / (RACKET_HEIGHT / 2)
                self.normalize_ball_dir()

    def normalize_ball_dir(self):
        # Ensure the direction vector has a magnitude of 1
        magnitude = (self.ball_dir['x'] ** 2 + self.ball_dir['y'] ** 2) ** 0.5
        if magnitude != 0:
            self.ball_dir['x'] /= magnitude
            self.ball_dir['y'] /= magnitude

class GameConsumer(AsyncWebsocketConsumer):
    room_id: int
    room_group_name: str

    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return
        self.room_id = await self.assign_room(self.user.username)
        self.room_group_name = f'game_{self.room_id}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_init_state()
        room = game_rooms[self.room_id]
        if len(room.players) == 2 and not room.game_loop_task:
            other_player = room.players[0] if room.players[1] == self else room.players[1]
            await other_player.send_player_info(self.user.username)
            room.game_state.start_game()
            room.game_loop_task = asyncio.create_task(self.game_loop(room))
            
    async def send_player_info(self, opponent):
        await self.send(text_data=json.dumps({
            'type': 'player_info',
            'opponent': opponent
        }))


    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Remove player from room
        room = game_rooms.get(self.room_id)
        if room:
            room.players = [p for p in room.players if p.channel_name != self.channel_name]
            # Notify the other player
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'player_disconnected',
                    'message': f'{self.user.username} has disconnected.'
                }
            )
            # If the game loop is running, cancel it
            if room.game_loop_task:
                room.game_loop_task.cancel()
                room.game_loop_task = None
            # If no players left, delete the room
            if not room.players:
                del game_rooms[self.room_id]

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'player_move':
            direction = data.get('direction')  # 'up' or 'down'
            await self.handle_player_move(direction)

    async def handle_player_move(self, direction):
        room = game_rooms.get(self.room_id)
        if not room:
            return

        # Determine which racket this player controls
        player_index = None
        for idx, player in enumerate(room.players):
            if player.channel_name == self.channel_name:
                player_index = idx
                break
        if player_index is None:
            return

        # Update racket position based on direction
        if player_index == 0:
            # Player 1 controls racket1
            if direction == 'up':
                room.game_state.racket1_pos['y'] -= room.game_state.ball_speed  # You can adjust speed
                room.game_state.racket1_pos['y'] = max(0, room.game_state.racket1_pos['y'])
            elif direction == 'down':
                room.game_state.racket1_pos['y'] += room.game_state.ball_speed
                room.game_state.racket1_pos['y'] = min(CANVAS_HEIGHT - RACKET_HEIGHT, room.game_state.racket1_pos['y'])
        elif player_index == 1:
            # Player 2 controls racket2
            if direction == 'up':
                room.game_state.racket2_pos['y'] -= room.game_state.ball_speed
                room.game_state.racket2_pos['y'] = max(0, room.game_state.racket2_pos['y'])
            elif direction == 'down':
                room.game_state.racket2_pos['y'] += room.game_state.ball_speed
                room.game_state.racket2_pos['y'] = min(CANVAS_HEIGHT - RACKET_HEIGHT, room.game_state.racket2_pos['y'])

    async def send_init_state(self):
        room = game_rooms.get(self.room_id)
        if not room:
            return

        game_state = {
            'type': 'init_state',
            'game_state': {
                'player_id': room.players.index(self) + 1,
                'room_id': self.room_id,
                'racket1_pos': room.game_state.racket1_pos,
                'racket2_pos': room.game_state.racket2_pos,
                'ball_pos': room.game_state.ball_pos,
                'score1': room.game_state.score1,
                'score2': room.game_state.score2,
                'player': room.players[0].user.username,
                'opponent': room.players[1].user.username if len(room.players) > 1 else 'waiting...'
            }
        }

        await self.send(text_data=json.dumps(game_state))

    async def send_game_state(self, state):
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'state': state
        }))

    async def player_disconnected(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'message': message
        }))

    async def game_loop(self, room):
        try:
            while True:
                await asyncio.sleep(1 / GAME_TICK_RATE)
                self.update_game_state(room.game_state)
                elapsed_time = room.game_state.get_elapsed_time()
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'broadcast_game_state',
                        'state': {
                            'ball_pos': room.game_state.ball_pos,
                            'racket1_pos': room.game_state.racket1_pos,
                            'racket2_pos': room.game_state.racket2_pos,
                            'score1': room.game_state.score1,
                            'score2': room.game_state.score2,
                            'elapsed_time': elapsed_time,
                            }
                    }
                )
        except asyncio.CancelledError:
            pass

    def update_game_state(self, game_state):
        # Update ball position
        game_state.ball_pos['x'] += game_state.ball_dir['x'] * game_state.ball_speed
        game_state.ball_pos['y'] += game_state.ball_dir['y'] * game_state.ball_speed

        # Check for collisions with top and bottom walls
        if game_state.ball_pos['y'] - BALL_RADIUS <= 0 or game_state.ball_pos['y'] + BALL_RADIUS >= CANVAS_HEIGHT:
            game_state.ball_dir['y'] *= -1

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

    def serialize_game_state(self, game_state):
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
        room = game_rooms.get(self.room_id)
        if not room:
            return

        winner = 'Player 1' if room.game_state.score1 >= MAX_SCORE else 'Player 2'
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_over',
                'winner': winner
            }
        )

    async def game_over(self, event):
        winner = event['winner']
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'winner': winner
        }))

    @database_sync_to_async
    def assign_room(self, username):
        # Assign the player to an existing room with less than 2 players or create a new room
        for room_id, room in game_rooms.items():
            if len(room.players) < 2:
                room.players.append(self)
                return room_id
        # Create a new room
        new_room_id = len(game_rooms)
        game_rooms[new_room_id] = GameRoom(room_id=new_room_id)
        game_rooms[new_room_id].players.append(self)
        return new_room_id

class GameRoom:
    def __init__(self, room_id):
        self.room_id = room_id
        self.players = []
        self.game_state = GameState(room_id)
        self.game_loop_task = None
