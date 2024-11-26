import { Router } from '../services/Router.js'
import '../components/register.js'
import '../components/login.js'
import { makeAuthRequest } from '../services/utils.js'
import notifications from '../components/notifications.js'
import { getMe } from '../services/utils.js'

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
            Oauth42();
        }
        else {
            this.appendChild(loginPage)
            login();
            Oauth42();
        }

        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'open-register') {
                console.log('heeeere', event.target.id);
                this.innerHTML = ''
                this.appendChild(registerPage)
                history.pushState(null, null, '/register');
                register();
                Oauth42();
            }

            if (event.target && event.target.id === 'close-register') {
                console.log('heeeere', event.target.id);
                this.innerHTML = ''
                this.appendChild(loginPage)
                history.pushState(null, null, '/login');
                login();
                Oauth42();
            }
        });

        let urlParams = new URLSearchParams(window.location.search);
        console.log('urlParams', urlParams);
        if (urlParams.has('error')) {
            notifications.notify(urlParams.get('error'), 'danger');
            window.history.replaceState(null, null, window.location.pathname);
        }
    }
}

export function attachDOM(page) {
    document.body.style = '';
    app.root.innerHTML = ''
    const authPage = document.createElement('auth-page');
    authPage.setAttribute('data-page', page);
    app.root.appendChild(authPage);
}

function Oauth42() {
    const button = document.querySelector('.btn1');

    button.addEventListener('click', () => {
        const redirectUri = encodeURIComponent('http://localhost/api/auth/oauth42/');

        window.location.href = 'https://api.intra.42.fr/oauth/authorize?' +
            'client_id=u-s4t2ud-2a476d713b4fc0ea1dfd09f1c6a9204cd6a43dc0c9a6a976d2ed239addacd68b&' +
            `redirect_uri=${redirectUri}&` +
            'response_type=code';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    Oauth42();
});

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
            let response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await response.json()
            console.log('data', data);
            app.email = data.email;
            try {
                if (response.status === 403) {
                    await fetch('/api/auth/generate-otp/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: data.email
                        })
                    }).then(res => {
                        res.json().then(res => {
                            console.log(res)
                            app.otp = res.otp_token;
                            console.log('app.otp from auth.js', app.otp);
                        })
                    }).catch(e => {
                        console.log('Error generating OTP', e);
                    })
                    Router.findRoute('/verify-otp');
                    return;
                }
                if (response.ok) {
                    console.log('access', data.access);
                    console.log('refresh', data.refresh);
                    // localStorage.setItem('access', data.access);
                    // localStorage.setItem('refresh', data.refresh);
                    notifications.notify('Login successful!', 'success');
                    Router.findRoute(`/`);
                } else {
                    console.log(data.error);
                    notifications.notify(data.error, 'danger');
                }
            } catch (e) {
                console.log('Error logging in', e);
            }
        } catch (e) {
            console.log('Error logging in');
            // notifications.notify(data.error, 'danger');
        }
    })
}

customElements.define('auth-page', Auth)
