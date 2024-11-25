import { makeAuthRequest } from "../services/utils.js";

export class Menu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const menuIcon = document.getElementById('menu-icon');
        const content = document.querySelector('.menu-content');

        menuIcon.addEventListener('click', function (event) {
            console.log('Menu component is rendered');
            menuIcon.classList.toggle('active');

            if (menuIcon.classList.contains('active')) {
                content.style.maxHeight = '500px';
                content.style.opacity = '1';
                content.style.overflow = 'visible';
            } else {
                closeMenu();
            }

            event.stopPropagation();
        });


        content.addEventListener('click', function (event) {
            event.stopPropagation();
        });


        document.addEventListener('click', function () {
            if (menuIcon.classList.contains('active')) {
                closeMenu();
            }
        });

        function closeMenu() {
            menuIcon.classList.remove('active');
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            content.style.overflow = 'hidden';
        }

        const home = document.querySelector('.home');
        const profile = document.querySelector('.avatar');
        const settings = document.querySelector('.setting');
        const logout = document.querySelector('.exit');

        home.addEventListener('click', e => {
            // e.preventDefault();
            app.router.findRoute('/');
        })

        profile.addEventListener('click', e => {
            e.preventDefault();
            makeAuthRequest('/api/auth/me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error('Failed to fetch user data');
            }).then(data => {
                app.loggedUser = data.username;
                app.router.findRoute(`/profile/${data.username}`);
            }).catch(error => {
                console.error(error);
            });
        })

        settings.addEventListener('click', e => {
            e.preventDefault();
            app.router.findRoute('/settings');
        })

        logout.addEventListener('click', e => {
            e.preventDefault();
            app.router.findRoute('/logout');
        })

    }

    disconnectedCallback() {
        this.innerHTML = '';
    }
}

customElements.define('app-menu', Menu);
