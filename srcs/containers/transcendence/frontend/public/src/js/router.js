function routing() {
    const path = window.location.pathname;
    switch (path) {
        // case '/game':
        //     setTimeout(() => {
        //         document.body.setAttribute('style', '');
        //         document.body.innerHTML = ''
        //         document.head.innerHTML = ''
        //         document.body.innerHTML = selectGame;
        //         selectedGame();
        //     }, 200);
        //     break;
        // case '/game_offline_2d':
        //     setTimeout(() => {
        //         document.body.setAttribute('style', '');
        //         document.body.innerHTML = ''
        //         document.head.innerHTML = ''
        //         document.body.innerHTML = game2dOfflineBody;
        //         game_2d_offline();
        //     }, 200);
        //     break;
        // case '/game_2d':
        //     setTimeout(() => {
        //         document.body.setAttribute('style', '');
        //         document.body.innerHTML = ''
        //         document.head.innerHTML = ''
        //         document.body.innerHTML = game2dBody;
        //         game_2d();
        //     }, 200);
        //     break;
        // case '/game_3d':
        //     setTimeout(() => {
        //         document.body.setAttribute('style', '');
        //         document.body.innerHTML = ''
        //         document.head.innerHTML = ''
        //         document.body.innerHTML = game3dBody;
        //         game_3d();
        //     }, 200);
        //     break;

    }
}

let registerBody = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="public/src/styles/styles.css">
</head>
<div class="registing" style="background-color: rgba(0, 0, 0, 0.6);">
    <img src="public/src/img/pingpong-logo.png" class="logo-log" style="margin: 10px;">
    <div class="registing">
        <div class="message">Enterning the requirts for your regist:</div>
        <input type="text" id="username" name="fname" placeholder="Username">
        <input type="text" id="fname" name="fname" placeholder="First Name">
        <input type="text" id="lname" name="fname" placeholder="Last Name">
        <input type="text" id="email" name="fname" placeholder="Email">
        <input type="password" id="pwd" name="pwd" placeholder="password">
        <button class="submit-button">Submit</button>
        <div class="message" style="color: #fff;">You can also create an account with</div>
        <div class="button-logs">
            <button class="btn1" type="button"></button>
            <button class="btn2" type="button"></button>
            <button class="btn3" type="button"></button>
        </div>
    </div>
</div>
`

let loginBody = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="public/src/styles/styles.css">
</head>
<div class="login">
<img src="public/src/img/pingpong-logo.png" class="logo-log">
<div class="log-contain">
    <input type="text" id="username" name="fname" placeholder="Username">
    <input type="password" id="pwd" name="pwd" placeholder="Password">
    <button class="submit-button">Submit</button>
    <div class="stay-sign">
        <input type="checkbox" id="stay-sign" name="stay-sign" value="stay-signed-in">
        <label for="stay-sign"> Stay Signed-in</label>
    </div>
    <div class="Sign-in">
        <div class ="message">not registed yet ?</div>
        <div class="Sign-in-button">Sign-in</div>
    </div>
    <div class="button-logs">
        <button class="btn1" type="button"></button>
        <button class="btn2" type="button"></button>
        <button class="btn3" type="button"></button>
    </div>
</div>
</div>
`

let selectGame = `
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 100px;
        }
        button {
            font-size: 20px;
            padding: 10px 20px;
            margin: 10px;
            cursor: pointer;
            background-color: #4CAF50;
        }
    </style>
</head>
<body>
    <h1>Select a Game</h1>
</body>
`


let game2dOfflineBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ping pong game</title>
  <link rel="stylesheet" href="gamess/css/game_style_offline.css">
  <link rel="icon" type="image/x-icon" href="gamess/images/140412.png">
</head>
<body>
  <canvas id="canvas" width="600" height="400"></canvas>
  <script src="gamess/js/game_offline.js"></script>
</body>
</html>

`

let game2dBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ping Pong Game</title>
  <link rel="stylesheet" href="gamess/css/style.css">
  <link rel="icon" type="image/x-icon" href="game/images/140412.png">
</head>
<body>
  <div id="header">
    <div id="score-board">
      <div>
        <span id="player1-name"></span> vs <span id="player2-name"></span>
      </div>
    <div id="timer">Time: <span id="timer-value">0:00</span></div>
      <div>
        <span id="score1">0</span> : <span id="score2">0</span>
      </div>

    </div>
  </div>
  
  <div id="game-container">
    <canvas id="canvas"></canvas>
  </div>
  
  <div id="notification-modal" class="modal">
    <div class="modal-content">
      <span id="modal-close" class="close">&times;</span>
      <p id="modal-message"></p>
    </div>
    
  </div>
  <div class="countdown"></div>

  <script src="gamess/js/game.js"></script>
</body>
</html>
`

let game3dBody = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="UTF-8" />
    <title>Three.js - Hello cube</title>
    <link rel="stylesheet" href="gamess/css/style_3d.css">
    <link rel="icon" type="image/x-icon" href="game/images/140412.png">
    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@v0.149.0/examples/jsm/"
        }
    }
    </script>
</head>
<body>
    <div id="threejs-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/cannon/build/cannon.min.js"></script>
	<script type="module" src="gamess/js/game_3d.js"></script>
</body>
</html>
`

let BodyTournament = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ping Pong Tournament - 4 Players</title>
    <link rel="stylesheet" href="tournoi/css/tournament.css">
</head>
<body>
    <div class="tournament-frame">
        <h1>🏓 Ping Pong Tournament 🏓</h1>
        
        <div class="tournament-bracket">
            <div class="round">
                <div class="match">
                    <div class="player1">...</div>
                    <div class="player2">...</div>
                </div>
                <div class="match">
                    <div class="player3">...</div>
                    <div class="player4">...</div>
                </div>
            </div>
            
            <div class="round">
                <div class="match">
                    <div class="winner1">...</div>
                    <div class="winner2">...</div>
                </div>
            </div>
            
            <div class="round">
                <div class="match">
                    <div class="winner_winner_chicken_dinner">Champion</div>
                </div>
            </div>
        </div>
        <div class="display_waiting">
            <div class="register-btn" id="register-id">
                <div class="Annancement"></div>
                <div class="player_in_queue"></div>
            </div>
        </div>
    </div>

    <script src="tournoi/js/tournament.js"></script>
</body>
</html>
`



async function selectedGame() {
    console.log('Select game!');
    const token = localStorage.getItem('access');
    console.log(token);
    if (!token) {
        alert('You must login first!');
        window.location.href = '/login';
    }

    try {
        const response = await fetch('http://localhost:8000/api/game/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        console.log('Response =>', response);
    } catch (e) {
        console.log('Error ==>', e);
    }
}


function game_2d() {
    import('../../../gamess/js/game.js').then(module => {module.game_2d();})
}

function game_3d() {
    import('../../../gamess/js/game_3d.js').then(module => {module.game_3d();})
}

function game_2d_offline() {
    import('../gamess/js/game_offline.js').then(module => {module.game_2d_offline();})
}

function tournament() {
    import('../tournoi/js/tournament.js').then(module => {module.tournament();})
}


// routing();
document.addEventListener('DOMContentLoaded', routing);


function go_to_path(body, fun) {
    setTimeout(() => {
        document.body.setAttribute('style', '');
        document.body.innerHTML = ''
        document.head.innerHTML = ''
        document.body.innerHTML = body;
    }, 100);
    setTimeout(() => {
        fun()
    }, 200);
}

export function navigate(url) {
    let check = false;
    for (const route of routes) {
        if (route.path === url) {
            history.pushState(null, null, url);
            go_to_path(route.body, route.component);
            check = true;
        }
    }
    if (check === false) {
        console.log('Page not found ', url);
    }
}



export let routes = [
    {
        path: '/game',
        body: selectGame,
        component: selectedGame
    },
    {
        path: '/game_offline_2d',
        body: game2dOfflineBody,
        component: game_2d_offline
    },
    {
        path: '/game_2d',
        body: game2dBody,
        component: game_2d
    },
    {
        path: '/game_3d',
        body: game3dBody,
        component: game_3d
    },
    {
        path: '/tournament',
        body: BodyTournament,
        component: tournament
    },

]