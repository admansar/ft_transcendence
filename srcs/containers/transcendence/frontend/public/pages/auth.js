import { Router } from '../services/Router.js'
import '../components/register.js'
import '../components/login.js'

class Auth extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const page = this.getAttribute('data-page');
        this.render(page);
    }

    render(page) {
        const registerPage = document.createElement('register-page');
        const loginPage = document.createElement('login-page');
        console.log(page);
        
        if (page === 'register') {
            this.appendChild(registerPage)
            register();
        }
        else {
            this.appendChild(loginPage)
            
            login();
        }
        
        document.addEventListener('click', (event) => {
            if (event.target && event.target.id === 'open-register') {
                this.innerHTML = ''
                this.appendChild(registerPage)
                register();
            }

            if (event.target && event.target.id === 'close-register') {
                this.innerHTML = ''
                this.appendChild(loginPage)
                login();
            }
        });
    }
}

export function attachDOM(page) {
    const authPage = document.createElement('auth-page');
    authPage.setAttribute('data-page', page);
    app.root.innerHTML = ''
    app.root.appendChild(authPage);
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
                Router.findRoute('/login');
                // window.location.href = '/login'
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
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const data = await response.json()
            if (response.ok) {
                console.log('access', data.access);
                console.log('refresh', data.refresh);
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                // console.log('cookie', document.cookie);
                Router.findRoute('/profile');
                // window.location.href = '/'
            } else {
                // logout();
                console.log(data.error);
                displayError(data.error)
            }
        } catch (e) {
            console.log('Error logging in');
            displayError(e)
            // alert('Error logging in');
        }
    })
}

function displayError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';

    setTimeout(() => {
        errorEl.textContent = '';
        errorEl.style.display = 'None';
    }, 3000);
}

customElements.define('auth-page', Auth)