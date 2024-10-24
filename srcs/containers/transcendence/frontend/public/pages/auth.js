class Auth extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dynamic Sign-in & Register</title>
                    <link rel="stylesheet" href="public/src/styles/styles.css">
                </head>
                <body>

                    
                    <div id="app"></div> 

                    
                    <script type="module" src="public/src/js/script.js"></script>
                    <script defer type="module" src="public/src/js/router.js"></script>
                </body>
        `
    }
}

export function attachDOM(authPage = 'login') {
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('style', '');
        document.head.innerHTML = ''
        const page = document.createElement('auth-page');
        document.body.appendChild(page);
        registerLogin(authPage);
    }, 100)
}

function registerLogin(page) {
    // console.log('Hello');
    // document.addEventListener('DOMContentLoaded', function () {        
    const app = document.getElementById('app'); // Target the container where HTML will be injected

    // Login Form HTML in JavaScript (Initial state)
    const loginForm = `
            <div class="login">
                <img src="public/src/img/pingpong-logo.png" class="logo-log">
                <div class="log-contain">
                        <input type="text" id="username" name="username" placeholder="Username">
                        <input type="password" id="pwd" name="pwd" placeholder="Password">
                        <button type="submit" class="submit-button">Connect</button>
                        <div class="stay-sign">
                            <input type="checkbox" id="stay-sign" name="stay-sign" value="stay-signed-in">
                            <label for="stay-sign"> Stay Signed-in</label>
                        </div>
                        <div class="line"></div>
                    <div class="Sign-in">
                        <div class="message">Not registered yet?</div>
                        <div class="Sign-in-button" id="open-register">Sign-in</div> <!-- Button to open registration form -->
                    </div>
                    <div class="button-logs">
                        <button class="btn1" type="button"></button>
                        <button class="btn2" type="button"></button>
                        <button class="btn3" type="button"></button>
                    </div>
                </div>
            </div>
        `;

    const registerForm = `
        <div class="registing" style="background-color: rgba(72, 95, 125, 0.6);">
            <img src="public/src/img/pingpong-logo.png" class="logo-log" style="margin: 10px;">
            <div class="registing">
                <div class="message">Enterning the requirts for your regist:</div>
                    <input type="text_reg" id="username" name="username" placeholder="Username">
                    <input type="text_reg" id="fname" name="fname" placeholder="First Name">
                    <input type="text_reg" id="lname" name="lname" placeholder="Last Name">
                    <input type="email_reg" id="email" name="email" placeholder="Email">
                    <input type="password" id="pwd" name="pwd" placeholder="Password">
                    <button type="submit" class="submit-button" id="submit_status">Submit</button>
                <div class="message" style="color: #fff;">You can also create an account with</div>
                <div class="button-logs">
                    <button class="btn1" type="button"></button>
                    <button class="btn2" type="button"></button>
                    <button class="btn3" type="button"></button>
                </div>
                <div class="close-register" id="close-register">Back to Login</div>
            </div>
            <div id="success-modal" class="modal hidden">
        <div class="modal-content">
            <span class="close-modal" id="close-modal">&times;</span>
            <p>You have successfully registered!</p>
        </div>
    </div>
            </div>
        `;

    if (page === 'register') {
        app.innerHTML = registerForm;
        register();
    }
    else {
        app.innerHTML = loginForm;
        login();
    }

    // Add event listener to switch between forms
    document.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'open-register') {
            app.innerHTML = registerForm;
            register();
        }

        if (event.target && event.target.id === 'close-register') {
            app.innerHTML = loginForm;
            login();
        }
    });
    // });
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
                console.log('access', token.access);
                console.log('refresh', token.refresh);
                localStorage.setItem('access', token.access);
                localStorage.setItem('refresh', token.refresh);
                alert('Login successful!')
                window.location.href = '/'
            } else {
                logout();
                alert(`Error: ${response.message}`)
            }
        } catch (e) {
            console.log('Error logging in');
            alert('Error logging in');
        }
    })
}

customElements.define('auth-page', Auth)