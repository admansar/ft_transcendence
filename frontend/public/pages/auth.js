import { Router } from '../services/Router.js'
import '../components/register.js'
import '../components/login.js'
import { makeAuthRequest } from '../services/utils.js'

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
            // let response = await fetch('http://localhost:8000/api/accounts/register/', {
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
            if (response.ok) {
                alert('Registration successful!')
                Router.findRoute('/login');
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
        const logContainElement = document.querySelector('.log-contain'); // Get the log container
        
        try {
            // let response = await makeAuthRequest('http://localhost:8000/api/accounts/login/', {
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
                Router.findRoute(`/`);
            } else {
                // login failed
                console.log(data.error);
                displayError(data.error);

                // Add error class to change border color to red
                logContainElement.classList.add('error'); // This triggers the red border

                // After 2 seconds, fade back to yellow
                setTimeout(() => {
                    logContainElement.classList.remove('error'); // Remove error class to reset border color
                }, 2000);
            }
        } catch (e) {
            console.log('Error logging in');
            displayError(e);
            
            // Add error class to change border color to red
            logContainElement.classList.add('error'); // This triggers the red border

            // After 2 seconds, fade back to yellow
            setTimeout(() => {
                logContainElement.classList.remove('error'); // Remove error class to reset border color
            }, 2000); 
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

// Custom CSS for error handling (will change the border color)
const style = document.createElement('style');
style.innerHTML = `
.log-contain {
    transition: all 1s ease; /* Smooth transition for border-color */
}
.log-contain.error {
    border-color: red !important; /* Change border color to red on error */
    box-shadow: 0px 0px 10px red;
}
`;
document.head.appendChild(style);

customElements.define('auth-page', Auth)
