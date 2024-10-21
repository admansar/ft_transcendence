class Login extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
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
                <div class="register">
                    <div class ="message">not registed yet ?</div>
                    <a href="/register" class="Sign-in-button">Register</a>
                </div>
                <div class="button-logs">
                    <button class="btn1" type="button"></button>
                    <button class="btn2" type="button"></button>
                    <button class="btn3" type="button"></button>
                </div>
            </div>
            </div>
        `
    }
}

export function attachDOM() {
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('style', '');
        document.head.innerHTML = ''
        const loginPage = document.createElement('login-page');
        document.body.appendChild(loginPage);
        login();
    }, 100)
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

function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    window.href.location = '/'
}

customElements.define('login-page', Login);