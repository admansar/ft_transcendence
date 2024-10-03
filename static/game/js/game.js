
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gameContainer = document.getElementById('game-container');
canvas.width = gameContainer.clientWidth; 
canvas.height = gameContainer.clientHeight;

let playerId = null;
let roomId = null;
let opponentName = '...';
let playerName = '...';

// Game state received from server
let gameState = {
  ball_pos: {x: 400, y: 300},
  racket1_pos: {x: 100, y: 230},
  racket2_pos: {x: 700, y: 230},
  score1: 0,
  score2: 0
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
    renderGame();
  }
  else if (data.type === 'game_state') {
    gameState = data.state;
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
    alert(data.message);
  }
  else if (data.type === 'game_over') {
    alert(`${data.winner} wins the game!`);
    // Optionally, reset the game or provide options to replay
  }
};

gameSocket.onclose = function () {
  console.log('Disconnected from the game server.');
};

// Sending player moves to the server
function sendPlayerMove(direction) {
  if (gameSocket.readyState === WebSocket.OPEN) {
    gameSocket.send(JSON.stringify({
      'type': 'player_move',
      'direction': direction
    }));
  }
}

// Keyboard event listeners
const keyPressed = {};
const KEY_UP = 38; // Arrow Up
const KEY_DOWN = 40; // Arrow Down
let isMovingUp = false;
let isMovingDown = false;
const MOVE_SPEED = 5; // Adjust paddle speed here

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

// Update paddle position based on key state
function updatePaddlePosition() {
    if (playerId === 1) { // Player 1 controls racket1
    //     if (isMovingUp) {
    //         gameState.racket1_pos.y -= MOVE_SPEED;
    //         gameState.racket1_pos.y = Math.max(0, gameState.racket1_pos.y);
    //     }
    //     if (isMovingDown) {
    //         gameState.racket1_pos.y += MOVE_SPEED;
    //         gameState.racket1_pos.y = Math.min(canvas.height - 120, gameState.racket1_pos.y);
    //     }
    // }
    // else if (playerId === 2) { // Player 2 controls racket2
    //     if (isMovingUp) {
    //         gameState.racket2_pos.y -= MOVE_SPEED;
    //         gameState.racket2_pos.y = Math.max(0, gameState.racket2_pos.y);
    //     }
    //     if (isMovingDown) {
    //         gameState.racket2_pos.y += MOVE_SPEED;
    //         gameState.racket2_pos.y = Math.min(canvas.height - 120, gameState.racket2_pos.y);
    //     }
    }
}

// Game loop to continuously update paddle position
function gameLoop() {
    updatePaddlePosition();
    renderGame();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

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