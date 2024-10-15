function routing() {
    const path = window.location.pathname;
    switch (path) {
        case '/register':
            console.log('regg');
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.head.innerHTML = ''
                document.body.innerHTML = registerBody;
                register()
            }, 100);
            break;
        case '/login':
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.head.innerHTML = ''
                document.body.innerHTML = loginBody;
                login()
            }, 100);
            break;
        case '/game':
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.head.innerHTML = ''
                document.body.innerHTML = selectGame;
                selectedGame();
            }, 200);
            break;
        case '/game_offline_2d':
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.head.innerHTML = ''
                document.body.innerHTML = game2dOfflineBody;
                // i want to get the jwt token from the local storage
                import('../gamess/js/game_offline.js').then(module => {
                    module.game_2d_offline();
                }
                )
            }, 200);
            break;
        case '/game_2d':
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.head.innerHTML = ''
                document.body.innerHTML = game2dBody;
                import('../gamess/js/game.js').then(module => {
                    module.game_2d();
                }
                )
            }, 200);
            break;
    }
}

let registerBody = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="styles.css">
</head>
<div class="registing" style="background-color: rgba(0, 0, 0, 0.6);">
    <img src="src/pingpong-logo.png" class="logo-log" style="margin: 10px;">
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
    <link rel="stylesheet" href="styles.css">
</head>
<div class="login">
<img src="src/pingpong-logo.png" class="logo-log">
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
  <link rel="icon" type="image/x-icon" href="gamess/images/140412.png">
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

  <script src="game/js/game.js"></script>
</body>
</html>
`



async function selectedGame() {
    console.log('Select game!');
    const token = localStorage.getItem('jwtToken');
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

function register() {
    const btn = document.querySelector('button.submit-button');
    btn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const first_name = document.getElementById('fname').value;
        const last_name = document.getElementById('lname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('pwd').value;

        try {
            let response = await fetch('http://localhost:8000/api/accounts/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                })
            })
            if (response.ok) {
                alert('Registration successful!')
                window.location.href = '/login'
            } else {
                alert(`Error: ${response.message}`)
            }
        } catch (e) {
            console.log('Error during registration');
            alert('Error during registration')
        }
    })
}

function login() {
    const btn = document.querySelector('button.submit-button');
    btn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('pwd').value;
        try {
            let response = await fetch('http://localhost:8000/api/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            if (response.ok) {
                const token = await response.json();
                console.log(token.jwt);
                localStorage.setItem('jwtToken', token.jwt);
                alert('Login successful!')
                window.location.href = '/'
            } else {
                alert(`Error: ${response.message}`)
            }
        } catch (e) {
            console.log('Error logging in');
            alert('Error logging in');
        }
    })
}

// routing();
document.addEventListener('DOMContentLoaded', routing);

