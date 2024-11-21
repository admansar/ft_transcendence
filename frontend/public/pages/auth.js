import { Router } from '../services/Router.js'
import '../components/register.js'
import '../components/login.js'
import { makeAuthRequest } from '../services/utils.js'
import notifications from '../components/notifications.js'
import app
 from '../components/state.js'
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
                history.pushState(null, null, '/register');
                register();
            }
            
            if (event.target && event.target.id === 'close-register') {
                this.innerHTML = ''
                this.appendChild(loginPage)
                history.pushState(null, null, '/login');
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
            let response = await fetch('/api/auth/register/', {
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
            let data = await response.json()
            if (response.ok) {
                notifications.notify('Registration successful!', 'success');
                setTimeout(() => {
                    Router.findRoute('/login');
                }, 1000);
            } else {
                Object.keys(data).forEach((field) => {
                    data[field].forEach((errorMessage) => {
                        notifications.notify(`${field}: ${errorMessage}`, 'danger');
                    });
                });
            }
        } catch (e) {
            console.log('Error during registration');
            notifications.notify('Error during registration', 'danger');
        }
    })
}

function login() {
    const btn = document.querySelector('button.submit-button');
    btn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('pwd').value;
       
        try {
            let response = await fetch('api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await response.json()

            if (response.ok) {
                console.log('access', data.access);
                console.log('refresh', data.refresh);
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                notifications.notify('Login successful!', 'success');
                setTimeout(() => {
                    Router.findRoute(`/`);
                }, 1000);
            } else {
                // login failed
                console.log(data.error);
                notifications.notify(data.error, 'danger');
            }
        } catch (e) {
            console.log('Error logging in');
            notifications.notify(data.error, 'danger');
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
