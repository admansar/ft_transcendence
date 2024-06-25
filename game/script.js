const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


canvas.width = window.innerWidth
canvas.height = window.innerHeight


/* ball details */

let ball_pos = {x : canvas.width / 2, y : canvas.height / 2}
let ratio = {x : 1, y : 1}
let direction  = {x : 1, y : 1}
let ball_ray = 15
let ball_speed = 10


/* rackets details */

let racket_speed = 15
let racket_width = 20
let racket_height = 140
let racket1_pos = {x: 100, y: canvas.height / 2}
let racket2_pos = {x: canvas.width - racket_width - racket1_pos.x, y: canvas.height / 2}


/*  config or settings  */


let animation = false
let debug = true


/* define    */


let MAX_SCORE = 5
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


/* mini menu */

let paused = false // Initial game state is not paused
let showMenu = false;



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
    if (this.pos.x - this.ray < 0)
      this.direction.x *= -1;
    else if (this.pos.x + this.ray >= canvas.width)
      this.direction.x *= -1;


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
}

/*********************************************************************/


/*******************************RACKET*********************************/

class Racket
{
  score = 0
  constructor(pos, speed, width, height, color="#ffffff", bot_mode=false)
  {
    this.pos = {...pos}
    this.speed = speed
    this.width = width
    this.height = height
    this.bot_mode = bot_mode
    this.color = color
    this.score = 0
  }

  up () // racket goes up
  {
    this.pos.y += this.speed
    if (this.pos.y + this.height >= canvas.height)
      this.pos.y = canvas.height - this.height
  }

  down () // racket goes down
  {
    this.pos.y -= this.speed
    if (this.pos.y <= 0)
      this.pos.y = 0
  }

  update()
  {
    if (!this.bot_mode)
    {
      if (this.pos.x > canvas.width / 2)
      {
        if (keyPressed[KEY_UP])
          this.down()
        else if (keyPressed[KEY_DOWN])
          this.up()
      }
      else
      {
        if (keyPressed[KEY_W])
          this.down()
        else if (keyPressed[KEY_S])
          this.up()
      }
    }
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
      ball.direction.x *= -1;
      let delta_y = ball.pos.y - (this.pos.y + this.height / 2);
      ball.direction.y = delta_y * 0.01; // adjust ball direction based on where it hits
      if (!is_aprox_inside(ball.direction.y, 0, 1))
        ball.direction.y -= Math.floor(ball.direction.y)
      if (ball.direction.y  == 0)
        ball.direction.y = 0.1
      ball.speed = !(ball.speed <= MAX_SCORE) ? ball.speed * (1 + SPEED_PERCENT) : MAX_SPEED
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
      if (this.pos.x > canvas.height / 2 && ball.direction.x > 0) // right racket (PLAYER 2)
      {
        if (ball.pos.y > this.pos.y + this.width / 2)
          this.up()
        else if (ball.pos.y < this.pos.y - this.width / 2)
          this.down()
      }
      else if (this.pos.x <= canvas.height / 2 && ball.direction.x < 0) // left (PLAYER 1)
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


const racket1 = new Racket(racket1_pos, racket_speed, racket_width, racket_height, color="#33ff00", bot_mode=false)
const racket2 = new Racket(racket2_pos, racket_speed, racket_width, racket_height, color="#FF3333", bot_mode=true)







/*     key hooks    */

function hooks(e)
{
  keyPressed[e.keyCode] = true 

  if (e.keyCode === KEY_SPACE)
  {
    paused = !paused
    draw_string(100, "#ffffff", "Pause", canvas.width / 2, canvas.height / 2)
    if (!paused)
      game_loop()
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

function drawMenu()
{
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  draw_string(50, "#ffffff", "Game Menu", canvas.width / 2, canvas.height / 2 - 100);
  draw_string(30, "#ffffff", "Press R to Restart", canvas.width / 2, canvas.height / 2);
  draw_string(30, "#ffffff", "Press ESC to Resume", canvas.width / 2, canvas.height / 2 + 50);
}

function is_inside (to_cmp, min, max)
{
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

function ball_racket_union(ball, racket)
{
  let racket_left = racket.pos.x;
  let racket_right = racket.pos.x + racket.width;
  let racket_top = racket.pos.y;
  let racket_bottom = racket.pos.y + racket.height;

  if (ball.pos.x + ball.ray > racket_left && ball.pos.x - ball.ray < racket_right &&
      ball.pos.y + ball.ray >= racket_top && ball.pos.y - ball.ray <= racket_bottom)
  {
    ball.direction.x *= -1;
    let delta_y = ball.pos.y - (racket.pos.y + racket.height / 2);
    ball.direction.y = delta_y * 0.01; // adjust ball direction based on where it hits
    if (!is_aprox_inside(ball.direction.y, 0, 1))
      ball.direction.y -= Math.floor(ball.direction.y)
    if (ball.direction.y  == 0)
      ball.direction.y = 0.1
    ball.speed = !(ball.speed <= MAX_SCORE) ? ball.speed * (1 + SPEED_PERCENT) : MAX_SPEED
  }
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
  reset_ball(ball);
  paused = false;
}

function reset_ball(ball)
{
  ball.pos = {...ball_pos}
  ball.speed = ball_speed
 // ball_pos, ratio, ball_ray, direction,  ball_speed
}

function score_update(ball, racket, other_racket)
{
  if (ball.pos.x - ball.ray < 0)
  {
    other_racket.incrementScore()
    reset_ball(ball)
  }
  if (ball.pos.x + ball.ray >= canvas.width)
  {
    racket.incrementScore()
    reset_ball(ball)
  }
}

function check_edges(ball)
{
  if (ball.pos.x - ball.ray < 0)
    ball.direction.x *= -1;
  else if (ball.pos.x + ball.ray >= canvas.width)
    ball.direction.x *= -1;


  if (ball.pos.y - ball.ray < 0)
  {
    ball.pos.y = ball.ray;
    ball.direction.y *= -1;
  }
  else if (ball.pos.y + ball.ray >= canvas.height)
  {
    ball.pos.y = canvas.height - ball.ray;
    ball.direction.y *= -1;
  }
}

function game_update()
{
  ball.update()
  racket1.update()
  racket2.update()
  score_update(ball, racket1, racket2)
  // racket1.bot(ball)
  // racket2.bot(ball)
  racket1.botv2 (ball)  // always check racket.bot_mode
  racket2.botv2 (ball)
  racket1.inter_ball(ball)
  racket2.inter_ball(ball)
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
  draw_string(50, "#ffffff", racket1.score.toString(), canvas.width / 4, 100)
  draw_string(50, "#ffffff", racket2.score.toString(), 3 * canvas.width / 4, 100)
  if (debug)
  {
    let traject = predict_ball_trajectory(ball, 100)
   
    draw_string (50, "#ffffff", ".", TRAJECTORY.x, TRAJECTORY.y)
    draw_traject(traject)
  }
}

function game_over()
{
  if (racket1.score == MAX_SCORE)
  {
    ball.ray = 0
    game_draw()
    draw_string(100, "#ffffff", "player 2 win", canvas.width / 2, canvas.height / 2)
    return (1)
  }
  if (racket2.score == MAX_SCORE)
  {
    ball.ray = 0
    game_draw()
    draw_string(100, "#ffffff", "player 1 win", canvas.width / 2, canvas.height / 2)
    return (1)
  }
  return (0)
}

function game_loop()
{
  if (game_over() || paused || showMenu)
    return
  game_update()
  game_draw()
  window.requestAnimationFrame(game_loop)
}

function main()
{
  game_loop()
}


main();