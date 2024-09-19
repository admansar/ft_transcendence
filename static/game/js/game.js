
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


canvas.width = window.innerWidth
canvas.height = window.innerHeight
const win_ratio = canvas.height;

let current_player = "not set yet 1";
let other_player = "not set yet 2";
let old_data = null;
let data = null;
let player_id = 0;


// let roomName = null;

// function createOrJoinRoom()
// {
//     roomName = prompt("Enter a room name to create or join:");
//     if (!roomName)
//     {
//         roomName = 'default_room';
//     }
//     connectWebSocket();
// }

let url = `ws://${window.location.host}/ws/game/`;
const chatSocket = new WebSocket(url);

function send_costum_message(message)
{
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN)
    chatSocket.send(JSON.stringify(message));
}

function connectWebSocket()
{
  chatSocket.onopen = function (e)
  {
    // console.log("WebSocket connection established");
    // console.log (data)
    // console.log ("--------------------------------------")
    if (data == null)
      chatSocket.send(JSON.stringify({
          'type': 'join_game',
          // 'ball_speed': ball_speed / window.innerWidth,
      }));

  };

  chatSocket.onmessage = function (e) {
      data = JSON.parse(e.data);
      if (old_data == null)
        old_data = data;
      // console.log('Data received:', data);
      // console.log('Old data:', old_data);
      // console.log ('player id : ', player_id)

      if (data.type === 'initial_state')
      {
        player_id = old_data.game_state.player_count;
        player1_name = data.game_state.player1_name;
        player2_name = data.game_state.player2_name;
        current_player = (player_id === 1) ? player1_name : player2_name;
        other_player = (current_player === player1_name) ? player2_name : player1_name;
        updatePlayerNames();
      }
      else if (data.type === 'game_state')
      {
        player_id = old_data.game_state.player_count;
        player1_name = data.player1_name
        player2_name = data.player2_name
        current_player = (player_id === 1) ? player1_name : player2_name;
        other_player = (current_player === player1_name) ? player2_name : player1_name;
        updatePlayerNames();
      }
      else if (data.type === 'game_start')
      {
        player1_name = (old_data.player1_name === data.player1_name) ? old_data.player1_name : data.player1_name; 
        player2_name = data.player2_name
        current_player = (player_id === 1) ? player1_name : player2_name;
        other_player = (current_player === player1_name) ? player2_name : player1_name;
        ball_speed = data.ball_speed * canvas.width
        // paused = false;
        game_loop();
      }
      else if (data.type === 'moves')
      {
        // console.log ('data : ', data)
        // console.log ('ball_speed <> paddle_speed : ', ball.speed, racket1.speed)
        if (data.id !== player_id)
        {
          if (data.is_right)
          {
            racket2.pos.y = data.position * win_ratio;
          }
          else if (data.is_left)
          {
            racket1.pos.y = data.position * win_ratio;
          }
        }
      }
      else if (data.type === 'pause')
      {
        paused = true;
        draw_string(100, "#ffffff", "Pause", canvas.width / 2, canvas.height / 2)
      }
      else if (data.type === 'resume')
      {
        paused = false;
        console.log ('resume time : ', new Date().getTime())
        game_loop();
      }
      else if (data.type === 'bounce')
      {
        ball.direction = data.direction;
        if (data.id == 2)
        {
          if (data.is_left)
            ball.pos.x = racket1.pos.x + racket1.width + ball.ray - 1;
          else if (data.is_right)
            ball.pos.x = racket2.pos.x - ball.ray;
        }
        else if (data.id == 1)
        {
          if (data.is_right)
            ball.pos.x = racket2.pos.x - ball.ray;
          else if (data.is_left)
            ball.pos.x = racket1.pos.x + racket1.width + ball.ray;
        }
      }
      else if (data.type === 'score')
      {
        racket1.score = data.score1;
        racket2.score = data.score2;
        ball.pos = data.pos;
        ball.direction = data.direction;
        ball.speed = data.speed;
        ball.ray = data.ray;
      }
      if (data.type)
        console.log ('data type : ', data.type, 'ana id : ', data.id)
  };


  chatSocket.onclose = function (e) {
    connectionStatus.textContent = 'Disconnected. Reconnecting...';
    setTimeout(connectWebSocket, 1000);
  };

  chatSocket.onerror = function (e) {
    console.error('WebSocket error:', e);
    connectionStatus.textContent = 'Error occurred';
  };


  return chatSocket;
}

function updatePlayerNames()
{
  draw_screen();
  draw_string(50, "#ffffff", player1_name + " : " + racket1.score.toString(), canvas.width / 4, 100);
  draw_string(50, "#ffffff", player2_name + " : " + racket2.score.toString(), 3 * canvas.width / 4, 100);
}


// function direction_y_calculator(racket, ball)
// {
//   let ball_dir = 0;

//   // let delta_y = ball.pos.y - (racket.pos.y);

//   // ball_dir = delta_y / window.innerHeight; // adjust ball direction based on where it hits
//   // console.log ('ball.direction.y : ', ball_dir)
//   // if (!is_aprox_inside(ball_dir, 0, 1))
//   //   ball_dir -= Math.floor(ball_dir)
//   // if (ball_dir == 0)
//   //   ball_dir = window.innerWidth / 1000
//   return ball_dir
// }


// FRONTEND


let player1_name = "player1";
let player2_name = "player2";


/* ball details */

let racket_pos = {x : canvas.width / 50, y : canvas.height / 2}
let ball_pos = {x : canvas.width / 2, y : canvas.height / 2}
let ratio = {x : 1, y : 1}
let direction  = {x : 1, y : 0}
let ball_ray = canvas.width / 70 // 15


/* rackets details */

let racket_width = canvas.width / 50// 20
let racket_height = canvas.height / 10// 140
let racket1_pos = {x: racket_pos.x, y: racket_pos.y}
let racket2_pos = {x: canvas.width - racket_width - racket_pos.x, y: racket_pos.y}


let ball_speed = ball_speed_calculator();
let racket_speed = ball_speed;
/*  config or settings  */


let animation = false
let debug = false


/* define    */


let MAX_SCORE = 50000
let MAX_SPEED = 35
let SPEED_PERCENT = 5 / 100   // 5 per cent


/*  keys  */

const keyPressed = []
const KEY_UP = 38
const KEY_DOWN = 40
const KEY_SPACE = 32 // Spacebar for pause/resume
const KEY_ESC = 27; // esc
const KEY_R = 82;
const KEY_W = 87;
const KEY_S = 83;
const KEY_ENTER = 13;

/* mini menu */

let paused = false // Initial game state is not paused
let showMenu = false;


function ball_speed_calculator()
{
  return Math.sqrt(((canvas.width) * direction.x) ** 2 + ((canvas.height - (2 * racket_pos.y) - (racket_height / 2 + ball_ray)) * direction.y) ** 2) / 100.0;
}


/********************************BALL*********************************/

class Ball
{
  constructor(pos, ratio, ray, direction, speed, color="#ffffff")
  {
    this.pos = {...pos}
    this.ratio = {...ratio}
    this.ray = ray
    this.direction = {...direction}
    this.speed = speed
    this.color = color
  }

  clone ()
  {
    return new Ball(this.pos, this.ratio, this.ray, this.direction, this.speed, this.color)
  }

  check_edges()
  {
    if (this.pos.y - this.ray < 0)
    {
      this.pos.y = this.ray;
      this.direction.y *= -1;
    }
    else if (this.pos.y + this.ray >= canvas.height)
    {
      this.pos.y = canvas.height - this.ray;
      this.direction.y *= -1;
    }
  }

  update()
  {
    this.pos.x += this.ratio.x * this.direction.x * this.speed
    this.pos.y += this.ratio.y * this.direction.y * this.speed
    this.check_edges()
  }
  draw()
  {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(ball.pos.x, ball.pos.y, ball.ray, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }

  reset()
  {
    this.pos = {...ball_pos}
    this.speed = ball_speed
    this.ray = ball_ray
    send_costum_message({type: 'score',
    'score1': racket1.score,
    'score2': racket2.score,
    'pos': ball.pos,
    'direction': ball.direction,
    'id': player_id,
    'speed': ball_speed,
    'ray': ball_ray
    })
  }
}

/*********************************************************************/



/*******************************RACKET*********************************/

class Racket
{
  score = 0
  constructor(username, pos, speed, width, height, color="#ffffff", bot_mode=false)
  {
    this.name = username
    this.pos = {...pos}
    this.speed = speed
    this.width = width
    this.height = height
    this.bot_mode = bot_mode
    this.color = color
    this.score = 0
    if (this.pos.x <= canvas.width / 2)
    {
      this.is_left = true
      this.is_right = false
    }
    else
    {
      this.is_left = false
      this.is_right = true
    }
  }

  up () // racket goes up
  {
    this.pos.y += this.speed
    if (this.pos.y + this.height >= canvas.height)
      this.pos.y = canvas.height - this.height
      send_costum_message({type: 'move',
      'position': (this.pos.y / win_ratio),
      'id': player_id,
      'is_right': this.is_right,
      'is_left': this.is_left
      })
  }

  down () // racket goes down
  {
    this.pos.y -= this.speed
    if (this.pos.y <= 0)
      this.pos.y = 0
    send_costum_message({type: 'move',
    'position': (this.pos.y / win_ratio),
    'id': player_id,
    'is_right': this.is_right,
    'is_left': this.is_left
    })
    // console.log ('position : ', this.pos)
    // console.log (' win_ratio : ', win_ratio)
    // console.log ('position / win_ratio : ', (this.pos.y / win_ratio))
  }

  update()
  {
    if (!this.bot_mode)
    {
      if (this.is_right)
      {
        if (keyPressed[KEY_UP])
        {
          this.down()
        }
        else if (keyPressed[KEY_DOWN])
        {
          this.up()
        }
      }
      else
      {
        if (keyPressed[KEY_W])
        {
          this.down()
        }  
        else if (keyPressed[KEY_S])
        {
          this.up()
        } 
      }
    }
    // if (action)
    // {
    //   sendPlayerAction(action);
    // }
  }

  inter_ball(ball)
  {
    let racket_left = this.pos.x;
    let racket_right = this.pos.x + this.width;
    let racket_top = this.pos.y;
    let racket_bottom = this.pos.y + this.height;
    
    if (ball.pos.x + ball.ray > racket_left && ball.pos.x - ball.ray < racket_right &&
      ball.pos.y + ball.ray >= racket_top && ball.pos.y - ball.ray <= racket_bottom)
    {
      if (this.is_left && ball.pos.x - ball.speed <= this.pos.x + this.width) // left
        ball.pos.x = this.pos.x + ball.ray + this.width
      else if (this.is_right && ball.pos.x + ball.speed >= this.pos.x)
        ball.pos.x = this.pos.x - ball.ray
      ball.direction.x *= -1;
      let delta_y = ball.pos.y - (this.pos.y + this.width / 2);
      ball.direction.y = delta_y * 0.01; // adjust ball direction based on where it hits
      // console.log ('ball.direction.y : ', ball.direction.y)
      if (!is_aprox_inside(ball.direction.y, 0, 1)) 
         ball.direction.y -= Math.floor(ball.direction.y)
      if (ball.direction.y == 0)
       ball.direction.y = 0.1
      
      send_costum_message({type: 'bounce',
      'direction': ball.direction,
      'id': player_id,
      'is_right': this.is_right,
      'is_left': this.is_left
       })
      //
    //  console.log ('correction for id : ', (player_id % 2) + 1)
      // ball.speed = Math.min(ball.speed * (1 + SPEED_PERCENT), MAX_SPEED)
      // ball.speed = ball_speed_calculator()
    }
  }

  score_update(ball)
  {
    if ((ball.pos.x - ball.ray < 0 && this.is_right)
      || (ball.pos.x + ball.ray >= canvas.width && this.is_left))
    {
      this.incrementScore()
      ball.reset()
      console.log ('time : ', new Date().getTime())

    console.log ('score !')
    }
  }

  draw()
  {
    ctx.fillStyle = this.color
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
  }

  getCentre()
  {
    return {x: this.width / 2, y: this.height / 2}
  }

  incrementScore()
  {
    this.score++
  }

  bot (ball) // hard coded
  {
    if (this.bot_mode)
    {
      if (this.is_right && ball.direction.x > 0) // right racket (PLAYER 2)
      {
        if (ball.pos.y > this.pos.y + this.width / 2)
          this.up()
        else if (ball.pos.y < this.pos.y - this.width / 2)
          this.down()
      }
      else if (this.is_left && ball.direction.x < 0) // left (PLAYER 1)
      {
        if (ball.pos.y > this.pos.y + this.width / 2)
          this.up()
        else if (ball.pos.y < this.pos.y - this.width / 2)
          this.down()
      }
    }
  }

  botv2 (ball) // smart, stable and improved
  {
    if (this.bot_mode)
    {
      let traject = predict_ball_racket_inter(ball, 100, this);
      let translated_y = this.pos.y + this.height / 2 // to make the ball hit the middle of the racket so db the racket is up to the middle
      if (is_aprox_inside(traject.x, this.pos.x, this.width))
      {
        if (translated_y < traject.y - this.width / 2)
          this.up()
        else if (translated_y > traject.y + this.width / 2)
          this.down()
      }
    }
  }
}

/**********************************************************************/


const ball = new Ball(ball_pos, ratio, ball_ray, direction,  ball_speed, color="#ffffff")


const racket1 = new Racket(player1_name, racket1_pos, racket_speed, racket_width, racket_height, color="#33ff00", bot_mode=false)
const racket2 = new Racket(player2_name, racket2_pos, racket_speed, racket_width, racket_height, color="#FF3333", bot_mode=false)







/*     key hooks    */


// function hooks(e)
// {
//   keyPressed[e.keyCode] = true;

//   if (e.keyCode === KEY_SPACE)
//   {
//       paused = !paused;
//       draw_string(100, "#ffffff", "Pause", canvas.width / 2, canvas.height / 2);
//       if (!paused)
//         game_loop();
//   }
//   else if (e.keyCode === KEY_ESC)
//   {
//       showMenu = !showMenu;
//       if (showMenu)
//         drawMenu();
//       else
//         game_loop();
//   }
//   else if (showMenu && e.keyCode === KEY_R)
//   {
//       reset_game();
//       showMenu = false;
//       game_loop();
//   }
//   else
//   {
//       let action = null;
//       if (e.keyCode === KEY_UP || e.keyCode === KEY_DOWN)
//           action = e.keyCode === KEY_UP ? 'move_up' : 'move_down';
//       else if (e.keyCode === KEY_W || e.keyCode === KEY_S)
//           action = e.keyCode === KEY_W ? 'move_up' : 'move_down';
//       if (action) sendPlayerAction(action);
//   }

//   if (e.keyCode === KEY_ENTER)
//       setPlayerReady(true);
// }



function hooks(e)
{
  keyPressed[e.keyCode] = true 

  if (e.keyCode === KEY_SPACE)
  {
    paused = !paused
    if (paused)
    {
      send_costum_message({type: 'pause'})
      draw_string(100, "#ffffff", "Pause", canvas.width / 2, canvas.height / 2)
    }
    if (!paused)
      send_costum_message({type: 'resume'})
      // game_loop()
  }
  else if (e.keyCode === KEY_ESC)
  {
    showMenu = !showMenu;
    if (showMenu)
      drawMenu();
    else
      game_loop();
  }
  else if (showMenu && e.keyCode === KEY_R)
  {
    reset_game();
    showMenu = false;
    game_loop();
  }
}

window.addEventListener('keydown', hooks)

window.addEventListener('keyup', function(e){
 keyPressed[e.keyCode] = false
})

/*     helper functions     */

function dist_two_point(a, b)
{
  return Math.sqrt (Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}



function drawMenu()
{
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  draw_string(50, "#ffffff", "Game Menu", canvas.width / 2, canvas.height / 2 - 100);
  draw_string(30, "#ffffff", "Press R to Restart", canvas.width / 2, canvas.height / 2);
  draw_string(30, "#ffffff", "Press ESC to Resume", canvas.width / 2, canvas.height / 2 + 50);
}

function is_inside (to_cmp, a, b)
{
  let max = a > b ? a : b;
  let min = a > b ? b : a;
  return (to_cmp >= min && to_cmp <= max)
}

function is_aprox_inside(to_cmp, centre_intervale, epsilon)
{
  return (to_cmp >= centre_intervale - epsilon && to_cmp <= centre_intervale + epsilon)
}


function draw_string(fontSize=50, color, string_to_print, x, y)
{
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color
  ctx.fillText(string_to_print, x, y)
}

function draw_traject(trajectory)
{
  ctx.strokeStyle = "#ff0000"; // color for the predicted path
  ctx.beginPath();
  for (let i = 0; i < trajectory.length - 1; i++)
  {
    ctx.moveTo(trajectory[i].x, trajectory[i].y);
    ctx.lineTo(trajectory[i + 1].x, trajectory[i + 1].y);
  }
  ctx.stroke();
}


/*   smart bot calcultors    */

function predict_ball_trajectory(ball, future_frames) //segment ball estimations
{
  let future_ball = ball.clone()
  let trajectory = []

  for (let i = 0; i < future_frames; i++)
  {
    future_ball.pos.x += future_ball.ratio.x * future_ball.direction.x * future_ball.speed;
    future_ball.pos.y += future_ball.ratio.y * future_ball.direction.y * future_ball.speed;
    
    if (future_ball.pos.y - future_ball.ray < 0 || future_ball.pos.y + future_ball.ray > canvas.height)
      future_ball.direction.y *= -1;
  
    // console.log (`ball direction : ${ball.direction.y} ; future dire : ${future_ball.direction.y}`)
    trajectory.push({ x: future_ball.pos.x, y: future_ball.pos.y});
  }

  return trajectory;
}

let TRAJECTORY = {x: 0, y: 0}  // no static, so ill use global as a static

function predict_ball_racket_inter(ball, future_frames, racket)
{
  let future_ball = ball.clone()

  for (let i = 0; i < future_frames; i++)
  {
    future_ball.pos.x += future_ball.ratio.x * future_ball.direction.x * future_ball.speed;
    future_ball.pos.y += future_ball.ratio.y * future_ball.direction.y * future_ball.speed;

    if (future_ball.pos.y - future_ball.ray < 0 || future_ball.pos.y + future_ball.ray > canvas.height)
      future_ball.direction.y *= -1;

    if (is_aprox_inside(future_ball.pos.x, racket.pos.x, racket.width))
    {
      TRAJECTORY = {x:  future_ball.pos.x , y: future_ball.pos.y}
      break ;
    }
  }
  return TRAJECTORY;
}

/* some additons */

function reset_game()
{
  racket1.score = 0;
  racket2.score = 0;
  ball.reset()
  paused = false;
}

function game_update()
{
  ball.update()
  racket1.update()
  racket2.update()
  racket1.inter_ball(ball)
  racket2.inter_ball(ball)
  racket1.score_update(ball)
  racket2.score_update(ball)
  racket1.botv2 (ball)  // always check racket.bot_mode
  racket2.botv2 (ball)
}


function draw_screen() // the background
{
  if (animation)
  {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  else
  {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

function game_draw()
{
  draw_screen()
  ball.draw()
  racket1.draw()
  racket2.draw()
  draw_string(50, "#ffffff", player1_name + " : " + racket1.score.toString(), canvas.width / 4, 100)
  draw_string(50, "#ffffff", player2_name + " : " + racket2.score.toString(), 3 * canvas.width / 4, 100)
  if (debug)
  {
    let traject = predict_ball_trajectory(ball, 100)
   
    draw_string (50, "#ffffff", ".", TRAJECTORY.x, TRAJECTORY.y)
    draw_traject(traject)
  }
}

function game_over() // on progress
{
    let winner = null;
  
    if (racket1.score >= MAX_SCORE)
      winner = player1_name;
    else if (racket2.score >= MAX_SCORE)
      winner = player2_name;
  
    if (winner) {
      ball.ray = 0;
      game_draw();
      draw_string(100, "#ffffff", `${winner} wins!`, canvas.width / 2, canvas.height / 2);
      paused = true;
      send_costum_message({ type: 'game_over', winner: winner });
      return true;
    }
  
    return false;
}

let i = 0;

function game_loop()
{
  if (game_over() || paused || showMenu)
    return
  game_update()
  game_draw()
  animation = true
  window.requestAnimationFrame(game_loop)
}

function main()
{
  draw_screen ()
  paused = true
  connectWebSocket()
  // console.log ('time : ', new Date().getTime())
  // game_loop()
}


main();
