// game.js

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
    console.log (`Opponent: ${opponentName}`);
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
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;
let moveInterval = null;
const MOVE_INTERVAL_MS = 60; // Adjust as needed

window.addEventListener('keydown', function(e) {
    if (keyPressed[e.keyCode]) return; // Prevent multiple intervals
    keyPressed[e.keyCode] = true;

    if (playerId === 1) { // Player 1 controls racket1
        if (e.keyCode === KEY_UP) {
            sendPlayerMove('up');
            moveInterval = setInterval(() => sendPlayerMove('up'), MOVE_INTERVAL_MS);
        }
        else if (e.keyCode === KEY_DOWN) {
            sendPlayerMove('down');
            moveInterval = setInterval(() => sendPlayerMove('down'), MOVE_INTERVAL_MS);
        }
    }
    else if (playerId === 2) { // Player 2 controls racket2
        if (e.keyCode === KEY_UP) {
            sendPlayerMove('up');
            moveInterval = setInterval(() => sendPlayerMove('up'), MOVE_INTERVAL_MS);
        }
        else if (e.keyCode === KEY_DOWN) {
            sendPlayerMove('down');
            moveInterval = setInterval(() => sendPlayerMove('down'), MOVE_INTERVAL_MS);
        }
    }
});

window.addEventListener('keyup', function(e) {
    keyPressed[e.keyCode] = false;
    if (moveInterval) clearInterval(moveInterval);
});


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
  // ctx.stroke();

  // Draw racket1
  ctx.fillStyle = "#33FF00";
  drawRoundedRect(gameState.racket1_pos.x, gameState.racket1_pos.y, 20, 120, 10, "#33FF00");

  // Draw racket2
  ctx.fillStyle = "#FF3333";
  drawRoundedRect(gameState.racket2_pos.x, gameState.racket2_pos.y, 20, 120, 10, "#FF3333");
  // Draw scores
  // ctx.font = "30px Arial";
  // ctx.fillStyle = "#FFFFFF";
  // ctx.textAlign = "center";
  // ctx.fillText(`${gameState.score1}`, canvas.width / 4, 50);
  // ctx.fillText(`${gameState.score2}`, 3 * canvas.width / 4, 50);

  // // Draw player names
  // ctx.fillText(`${playerName}`, canvas.width / 4, 80);
  // ctx.fillText(`${opponentName}`, 3 * canvas.width / 4, 80);
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

