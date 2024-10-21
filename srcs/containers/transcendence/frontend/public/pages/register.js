class Register extends HTMLElement {
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
    }
}

export function attachDOM() {
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('style', '');
        document.head.innerHTML = ''
        const registerPage = document.createElement('register-page');
        document.body.appendChild(registerPage);
        register();
    }, 100)
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

customElements.define("register-page", Register);