import { navigate } from "../../js/router.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gameContainer = document.getElementById('game-container');
const countdownElement = document.querySelector('.countdown');
const player1NameElement = document.getElementById('player1-name');
const player2NameElement = document.getElementById('player2-name');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');



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
const token = localStorage.getItem('jwtToken');
let roomName = 'room_01'; // This should be dynamic based on matchmaking or user selection
let gameSocket = new WebSocket(`ws://${window.location.host}/ws/game/${roomName}/?token=${token}`);

// WebSocket event handlers
gameSocket.onopen = function () {
  console.log('Connected to the game server.');
};

gameSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  // console.log ('data type : ', data.type)
  if (data.type === 'init_state') {
    playerId = data.game_state.player_id;
    roomId = data.game_state.room_id;
    roomName = data.game_state.room_name;
    opponentName = data.game_state.opponent;
    gameState.racket1_pos = data.game_state.racket1_pos;
    gameState.racket2_pos = data.game_state.racket2_pos;
    gameState.ball_pos = data.game_state.ball_pos;
    gameState.score1 = data.game_state.score1;
    gameState.score2 = data.game_state.score2;
    playerName = data.game_state.player;
    gameState.ball_speed = data.game_state.ball_speed;
    gameState.direction = data.game_state.direction;
    gameContainer.style.width = data.game_state.canvas_width + 'px';
    gameContainer.style.height = data.game_state.canvas_height + 'px';
    // if (gameSocket.readyState === WebSocket.OPEN) {
    //   gameSocket.close();
    // }

    // gameSocket.onclose = function() {
    //   // After the WebSocket is closed, open a new one
    //   gameSocket = new WebSocket(`ws://${window.location.host}/ws/game/${roomName}/`);
    //   resizeCanvas();
    //   console.log("New WebSocket opened after closing the previous one.");
    // };
    resizeCanvas();
    // renderGame();
  }
  else if (data.type === 'countdown') {
    console.log('Countdown: ', data.countdown);
    let dict = {
      '3': 'Ready',
      '2': 'Set',
      '1': 'Go!',
    };
    updateCountdown(dict[data.countdown]);

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
      setTimeout (function () {}, 1000)
      navigate('/')
  }
  else if (data.type === 'game_over') {
    show_notification(`${data.winner} wins the game!`);
    setTimeout (function () {}, 1000)
    navigate('/')
  }
  else if (data.type === 'broadcast_game_state')
  {
    gameState.ball_speed = data.game_state.ball_speed;
    gameState.direction = data.game_state.direction;
    server_fps = data.fps_ratio;
  }
  else if (data.type === 'moves')
  {
    if (playerId === 1)
      gameState.racket2_pos = data.racket2_pos;
    else if (playerId === 2)
      gameState.racket1_pos = data.racket1_pos;
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
      'racket1_pos': gameState.racket1_pos,
      'racket2_pos': gameState.racket2_pos,
      'player_id': playerId,
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
const MOVE_SPEED = 10; // Adjust paddle speed here

window.addEventListener('keydown', function(e) {
    if (e.keyCode === KEY_UP) {
        isMovingUp = true;
        // sendPlayerMove('up');
    }
    else if (e.keyCode === KEY_DOWN) {
        isMovingDown = true;
        // sendPlayerMove('down');
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
    let racket1_color = "#eac646";
    drawRoundedRect(gameState.racket1_pos.x, gameState.racket1_pos.y, 20, 120, 10, racket1_color);

    // Draw racket2
    let racket2_color = "#eac646";
    drawRoundedRect(gameState.racket2_pos.x, gameState.racket2_pos.y, 20, 120, 10, racket2_color);

    // Draw player names and scores

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



function updatePaddlePosition()
{
  if (playerId === 1) { // Player 1 controls racket1
      if (isMovingUp) {
          gameState.racket1_pos.y -= MOVE_SPEED;
          gameState.racket1_pos.y = Math.max(0, gameState.racket1_pos.y);
      }
      else if (isMovingDown) {
          gameState.racket1_pos.y += MOVE_SPEED;
          gameState.racket1_pos.y = Math.min(canvas.height - 120, gameState.racket1_pos.y);
      }
  }
  else if (playerId === 2) { // Player 2 controls racket2
      if (isMovingUp) {
          gameState.racket2_pos.y -= MOVE_SPEED;
          gameState.racket2_pos.y = Math.max(0, gameState.racket2_pos.y);
      }
      else if (isMovingDown) {
          gameState.racket2_pos.y += MOVE_SPEED;
          gameState.racket2_pos.y = Math.min(canvas.height - 120, gameState.racket2_pos.y);
      }
  }
  if (isMovingDown || isMovingUp) {

    sendPlayerMove(isMovingDown ? 'down' : 'up');

    console.log ("r1: ", gameState.racket1_pos,", r2: " , gameState.racket2_pos)
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
function game_loop()
{
  if (isMovingDown || isMovingUp)
  {
    updatePaddlePosition();
  }
  updateBallPosition();
  renderGame();
  requestAnimationFrame(game_loop);
}

function updateCountdown(txt = '') {
  countdownElement.textContent = txt;
  countdownElement.style.animation = 'none';
  countdownElement.offsetHeight; // Trigger reflow
  countdownElement.style.animation = null;
}

export function game_2d()
{
  if (token === null) {
    show_notification('You must login first!');
    // window.location.href = '/login';
    navigate('/login');
  }
  game_loop();
}

