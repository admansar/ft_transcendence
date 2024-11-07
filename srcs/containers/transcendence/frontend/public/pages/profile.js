import { Router } from '../services/Router.js'

class Profile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    async renderScore(data) {
        function winOrLose(score_a, score_b) {
            if (score_a > score_b) {
                return {
                    status: 'WIN',
                    color: 'green'
                }
            }
            return {
                status: 'LOSS',
                color: 'brown'
            }
        }
        if (!data.games) {
            return this.innerHTML = `
                <h1>No games found</h1>
            `
        }
        for (let i = 0; i < data.games.length; i++) {
            let score_a = data.games[i].score_a
            let score_b = data.games[i].score_b
            let avatar_a = data.games[i].avatar_a
            let avatar_b = data.games[i].avatar_b
            let matchResult = winOrLose(score_a, score_b);
            this.innerHTML += `
                <div class="history-bar">
                    <span class="my_profile_bar" style="border: 2px solid rgb(66, 193, 38);">
                        <img src="${avatar_a}" style="object-fit: cover; width: 100px; height: 100px;">
                    </span>
                    <span class="score_bar" style="background-color: ${matchResult.color};">
                        <span class="score_main">${score_a}</span>
                        <span class="status">${matchResult.status}</span>
                        <span class="score_guest">${score_b}</span>
                    </span>
                    <span class="challenger_bar" style="border: 2px solid rgb(193, 38, 38);">
                        <img src="${avatar_b}" style="object-fit: cover; width: 100px; height: 100px;">
                    </span>
                </div>
            `

        }
        return this.innerHTML;
    }

    async render() {
        try {
            let userData = await getUserData();
            console.log(userData);
            this.innerHTML = `
                <div class="dashbord-main">
                    <div class="right-side-dashbord">
                        <div class="profile-avatar">
                            <div class="pingpong-avatar-bar">
                                <div class="profile-photo"></div>
                            </div>
                            <div class="profile-status">
                                <div class="gird_status">
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Wins</div>
                                    <div class="grid-item ">1</div>
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Lose</div>
                                    <div class="grid-item ">1</div>
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Score</div>
                                    <div class="grid-item ">1</div>
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Block</div>
                                    <div class="grid-item ">1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-side-dashbord">
                        <div class="profile-dashbord">
                            <div class="username-profile-dashbord">${userData.username}</div>
                            <div class="lvl-profile-dashbord">lvl 100</div>
                            <div class="expbar-profile-dashbord">
                                <div class="user_exp"></div>
                            </div>
                        </div>
                        <div class="match-history-bar">
                            ${await this.renderScore(userData)}
                        </div>
                    </div>
                </div>
            `
            const avatar = document.querySelector('.profile-photo');
            const avatarMenu = document.querySelector('.profile');
            avatar.style.backgroundImage = `url(${userData.avatar})`;
            avatarMenu.style.backgroundImage = `url(${userData.avatar})`;
        } catch (e) {
            console.log(e);
            Router.findRoute('/login');
        }
    }
}

export function attachDOM() {
    const page = document.createElement('profile-page');
    document.body.appendChild(page);
}

async function getUserData() {
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }
    let response = await makeAuthRequest('http://localhost:8000/api/accounts/user/', options)

    if (!response.ok) {
        const error = await response.text();
        // alert(error)
        console.log(error);
        throw new Error(error);
    }
    const data = await response.json();

    options.method = 'POST';
    options.body = JSON.stringify({ username: data.username });
    response = await makeAuthRequest('http://localhost:8000/api/game/get-games', options)
    let games = await response.json();
    // console.log(games);
    data.games = games.games
    console.log('data', data);

    return data;
}

async function makeAuthRequest(url, options = {}) {
    options.credentials = 'include';

    let response = await fetch(url, options);
    // console.log(await response.json());

    if (response.status === 401) {
        const refreshRes = await fetch('http://localhost:8000/api/auth/refresh/', {
            method: 'POST',
            credentials: 'include'
        })
        if (refreshRes.ok) {
            response = await fetch(url, options)
        } else {
            console.log('Session expired, please login again');
            return;
        }
    }
    if (!response.ok) {
        throw new Error('Failed to make auth request')
    }
    return response
}


customElements.define('profile-page', Profile);