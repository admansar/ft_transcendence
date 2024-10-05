const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gameContainer = document.getElementById('game-container');
canvas.width = gameContainer.clientWidth; 
canvas.height = gameContainer.clientHeight;

let playerId = null;
let roomId = null;
let opponentName = '...';
let playerName = '...';
let fps_ratio = 1;
let server_fps = 30;


// Game state received from server
let gameState = {
  ball_pos: {x: 400, y: 300},
  racket1_pos: {x: 100, y: 230},
  racket2_pos: {x: 700, y: 230},
  score1: 0,
  score2: 0,
  ball_speed: 20,
  direction: {x: 1, y: 0},
};

// WebSocket connection
let roomName = 'room1'; // This should be dynamic based on matchmaking or user selection
let url = `ws://${window.location.host}/ws/game/${roomName}/`;
const gameSocket = new WebSocket(url);

// WebSocket event handlers
gameSocket.onopen = function () {
  console.log('Connected to the game server.');
};

gameSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  if (data.type !== 'broadcast_game_state')
   console.log ('data type : ', data.type)

  // console.log ('data type : ', data.type)
  if (data.type === 'init_state') {
    playerId = data.game_state.player_id;
    roomId = data.game_state.room_id;
    opponentName = data.game_state.opponent;
    gameState.racket1_pos = data.game_state.racket1_pos;
    gameState.racket2_pos = data.game_state.racket2_pos;
    gameState.ball_pos = data.game_state.ball_pos;
    gameState.score1 = data.game_state.score1;
    gameState.score2 = data.game_state.score2;
    playerName = data.game_state.player;
    gameState.ball_speed = data.game_state.ball_speed;
    gameState.direction = data.game_state.direction;
    renderGame();
  }
  else if (data.type === 'game_state') {
    gameState = data.state;
    gameState.ball_speed = data.ball_speed;
    gameState.direction = data.direction;
    renderGame();
    const elapsedTime = data.state.elapsed_time;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timer-value').innerText = formattedTime;
  }
  else if (data.type === 'player_info') {
    opponentName = data.opponent;
    console.log(`Opponent: ${opponentName}`);
  }
  else if (data.type === 'notification') {
    show_notification(data.message);
    if (data.message.indexOf ('has disconnected.') != -1)
      setTimeout (function () {window.location.href = '/';
      }, 1000)
  }
  else if (data.type === 'game_over') {
    show_notification(`${data.winner} wins the game!`);
    setTimeout (function () {window.location.href = '/';
  }, 1000)
  }
  else if (data.type === 'broadcast_game_state')
  {
    gameState.ball_speed = data.game_state.ball_speed;
    gameState.direction = data.game_state.direction;
    server_fps = data.fps_ratio;
  }
  else if (data.type === 'update_paddles')
  {
    gameState.racket1_pos = data.racket1_pos;
    gameState.racket2_pos = data.racket2_pos;
  }
};

gameSocket.onclose = function () {
  console.log('Disconnected from the game server.');
};

// Sending player moves to the server
function sendPlayerMove(direction) {
  console.log ('current positions: ', gameState.racket1_pos, gameState.racket2_pos)
  if (gameSocket.readyState === WebSocket.OPEN) {
    gameSocket.send(JSON.stringify({
      'type': 'player_move',
      'direction': direction,
      'racket1_pos': gameState.racket1_pos,
      'racket2_pos': gameState.racket2_pos,
    }));
  }
}

function show_notification(message) {
  const modal = document.getElementById('notification-modal');
  const modalMessage = document.getElementById('modal-message');
  const modalClose = document.getElementById('modal-close');

  modalMessage.textContent = message;
  modal.style.display = 'block';

  modalClose.onclick = function() {
      modal.style.display = 'none';
  };

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  };
}


// Keyboard event listeners
const keyPressed = {};
const KEY_UP = 38; // Arrow Up
const KEY_DOWN = 40; // Arrow Down
let isMovingUp = false;
let isMovingDown = false;
const MOVE_SPEED = 3; // Adjust paddle speed here

window.addEventListener('keydown', function(e) {
    if (e.keyCode === KEY_UP) {
        isMovingUp = true;
        sendPlayerMove('up');
    }
    else if (e.keyCode === KEY_DOWN) {
        isMovingDown = true;
        sendPlayerMove('down');
    }
});

window.addEventListener('keyup', function(e) {
    if (e.keyCode === KEY_UP) {
        isMovingUp = false;
    }
    else if (e.keyCode === KEY_DOWN) {
        isMovingDown = false;
    }
});

// Start the game loop
function resizeCanvas() {
    canvas.width = gameContainer.clientWidth; 
    canvas.height = gameContainer.clientHeight;
    renderGame();
}

window.addEventListener('resize', resizeCanvas);

// Rendering the game state
function drawRoundedRect(x, y, width, height, radius, fillColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
}

function renderGame() {
    // Clear the canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#eac646';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw the net
    ctx.beginPath();
    ctx.setLineDash([20, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#eac646';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw the ball
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(gameState.ball_pos.x, gameState.ball_pos.y, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Draw racket1
    ctx.fillStyle = "#33FF00";
    drawRoundedRect(gameState.racket1_pos.x, gameState.racket1_pos.y, 20, 120, 10, "#33FF00");

    // Draw racket2
    ctx.fillStyle = "#FF3333";
    drawRoundedRect(gameState.racket2_pos.x, gameState.racket2_pos.y, 20, 120, 10, "#FF3333");

    // Draw player names and scores
    const player1NameElement = document.getElementById('player1-name');
    const player2NameElement = document.getElementById('player2-name');
    const score1Element = document.getElementById('score1');
    const score2Element = document.getElementById('score2');

    if (player1NameElement) {
        player1NameElement.textContent = playerName;
    }
    if (player2NameElement) {
        player2NameElement.textContent = opponentName;
    }
    if (score1Element) {
        score1Element.textContent = gameState.score1;
    }
    if (score2Element) {
        score2Element.textContent = gameState.score2;
    }
}

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function fps_calculator()
{
    const now = performance.now();
    frameCount++;

    const elapsedTime = now - lastTime;
    if (elapsedTime >= 1000)
    {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
    }
    return fps;
}

let predictedRacket1PosY = gameState.racket1_pos.y;
let predictedRacket2PosY = gameState.racket2_pos.y;

function updatePaddlePosition() {
    if (playerId === 1) {
        if (isMovingUp) {
            predictedRacket1PosY -= MOVE_SPEED;
            predictedRacket1PosY = Math.max(0, predictedRacket1PosY);
        }
        if (isMovingDown) {
            predictedRacket1PosY += MOVE_SPEED;
            predictedRacket1PosY = Math.min(canvas.height - 120, predictedRacket1PosY);
        }
        gameState.racket1_pos.y = predictedRacket1PosY; // Move locally
    } else if (playerId === 2) {
        if (isMovingUp) {
            predictedRacket2PosY -= MOVE_SPEED;
            predictedRacket2PosY = Math.max(0, predictedRacket2PosY);
        }
        if (isMovingDown) {
            predictedRacket2PosY += MOVE_SPEED;
            predictedRacket2PosY = Math.min(canvas.height - 120, predictedRacket2PosY);
        }
        gameState.racket2_pos.y = predictedRacket2PosY; // Move locally
    }
}

function updateBallPosition()
{
  let current_fps = fps_calculator();
  fps_ratio = current_fps / server_fps;
  gameState.ball_pos.x += (gameState.ball_speed / fps_ratio) * gameState.direction.x;
  gameState.ball_pos.y += (gameState.ball_speed / fps_ratio) * gameState.direction.y;
  // console.log('Ball speed ', gameState.ball_speed);
}

// Game loop
function game_loop() {
  updatePaddlePosition();
  updateBallPosition();
  renderGame();
  requestAnimationFrame(game_loop);
}

// Start the game loop
game_loop();
