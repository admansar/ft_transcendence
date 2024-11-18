import { Router } from '../services/Router.js'
import { makeAuthRequest } from '../services/utils.js'

class Profile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const username = this.getAttribute('username');
        this.render(username);
    }

    async renderScore(data) {
        if (!data.games) {
            return `
                <span class="message" style="font-size: 20px;">No Games found, Go PLAY!</span>
            `
        }
        function displayMatchHistory(username, currentGame) {
            let matchResult;
            if (username === currentGame.player_a) {
                matchResult = winOrLose(currentGame.score_a, currentGame.score_b);
                // console.log(matchResult);
                return {
                    'avatar': currentGame.avatar_a,
                    'score': currentGame.score_a,
                    'opponent': currentGame.player_b,
                    'opponent_avatar': currentGame.avatar_b,
                    'opponent_score': currentGame.score_b,
                    'status': matchResult.status,
                    'color': matchResult.color
                }
            }
            matchResult = winOrLose(currentGame.score_b, currentGame.score_a);
            return {
                'avatar': currentGame.avatar_b,
                'score': currentGame.score_b,
                'opponent': currentGame.player_a,
                'opponent_avatar': currentGame.avatar_a,
                'opponent_score': currentGame.score_a,
                'status': matchResult.status,
                'color': matchResult.color
            }
        }
        function winOrLose(score_a, score_b) {
            if (score_a > score_b) {
                return {
                    status: 'WIN',
                    color: 'green'
                }
            } else if (score_a === score_b) {
                return {
                    status: 'DRAW',
                    color: 'orange'
                }
            }
            return {
                status: 'LOSS',
                color: 'brown'
            }
        }
        for (let i = 0; i < data.games.length; i++) {
            let gameStatus = displayMatchHistory(data.username, data.games[i]);
            this.innerHTML += `
                <div class="history-bar">
                    <span class="my_profile_bar" style="border: 2px solid rgb(66, 193, 38);">
                        <img src="${gameStatus.avatar}" style="object-fit: cover; width: 100px; height: 100px;">
                    </span>
                    <span class="score_bar" style="background-color: ${gameStatus.color};">
                        <span class="score_main">${gameStatus.score}</span>
                        <span class="status">${gameStatus.status}</span>
                        <span class="score_guest">${gameStatus.opponent_score}</span>
                    </span>
                    <span class="challenger_bar" style="border: 2px solid rgb(193, 38, 38);">
                        <img src="${gameStatus.opponent_avatar}" style="object-fit: cover; width: 100px; height: 100px;">
                    </span>
                </div>
            `
        }
        return this.innerHTML;
    }

    async getUserStats(userData) {
        if (userData.games && userData.username === userData.games[0].player_a) {
            return {
                'wins': userData.games.filter(game => game.score_a > game.score_b).length,
                'loses': userData.games.filter(game => game.score_a < game.score_b).length,
                'draws': userData.games.filter(game => game.score_a === game.score_b).length,
                'score': userData.games.reduce((acc, game) => acc + game.score_a, 0),
            }
        } else if (userData.games && userData.username === userData.games[0].player_b) {
            return {
                'wins': userData.games.filter(game => game.score_b > game.score_a).length,
                'loses': userData.games.filter(game => game.score_b < game.score_a).length,
                'draws': userData.games.filter(game => game.score_b === game.score_a).length,
                'score': userData.games.reduce((acc, game) => acc + game.score_b, 0),
            }
        }
        return {
            'wins': 0,
            'loses': 0,
            'draws': 0,
            'score': 0,
        }
    }

    async render(username) {
        try {
            let userData = await getUserData(username);
            console.log(userData);
            let userStats = await this.getUserStats(userData);
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
                                    <div class="grid-item ">${userStats.wins}</div>
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Lose</div>
                                    <div class="grid-item ">${userStats.loses}</div>
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Draws</div>
                                    <div class="grid-item ">${userStats.draws}</div>
                                    <div class="grid-item " style="font-size:25px; color: #ffc800;">Score</div>
                                    <div class="grid-item ">${userStats.score}</div>
                                </div>
                            </div>
                            <div class="tools_profile">
                            <span class="request_list pending_list" id="pending_list"></span>
                            <span class="request_list block_list" id="block_list"></span>
                            <span class="request_list share_profile" id="share_profil"></span>
                            </div>
                        </div>
                    </div>
                    <div class="left-side-dashbord">
                        <div class="profile-dashbord">
                            <div class="username-profile-dashbord">${userData.username}</div>
                            <div class="expbar-profile-dashbord">
                                <span class="user_exp">
                                    <span class="level">lvl 100</span>
                                    <span class="Experience">80%</span>
                                </span>
                            </div>
                        </div>
                        <div class="match-history-bar">
                            <div class="btn_static">
                                <span class="btn_static_click" id="history_bar">HISTORY</span>
                                <span class="btn_static_click" id="achivements_bar">ACHIVEMENTS</span>
                                <span class="btn_static_click" id="rank_bar">RANK</span>
                            </div>
                            <div class="HISTORYdata">
                                ${await this.renderScore(userData)}
                            </div>
                        </div>
                    </div>
                    <div class="pending_friends_modal" id="pendingModal">
                        <div class="modal_content">
                            <span class="close_modal">&times;</span>
                            <div class="fr_request_list" id="User">
                                <span class="fr_id">
                                    <span class="fr_avatar"></span>
                                    <span class="fr_name">USER</span>
                                </span>
                                <span class="requesting">
                                    <span class="accept_fr">Accept</span>
                                    <span class="reject_fr">Reject</span>
                                </span>
                            </div>
                            <div class="fr_request_list" id="User">
                            <span class="fr_id">
                                <span class="fr_avatar"></span>
                                <span class="fr_name">USER</span>
                            </span>
                            <span class="requesting">
                                <span class="accept_fr">Accept</span>
                                <span class="reject_fr">Reject</span>
                            </span>
                        </div>
                        </div>
                    </div>
                        
                        
                    <div class="Block_modal" id="blockModal">
                        <div class="block_modal_content">
                            <span class="close_modal">&times;</span>
                            <div class="block_list_display" id="User">
                                <span class="fr_id">
                                    <span class="fr_avatar"></span>
                                    <span class="fr_name">USER</span>
                                </span>
                                <span class="requesting">
                                    <span class="unblock_fr">UnBlock</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `
            const avatar = document.querySelector('.profile-photo');
            // const avatarMenu = document.querySelector('.profile');
            avatar.style.backgroundImage = `url(${userData.avatar})`;
            // avatarMenu.style.backgroundImage = `url(${userData.avatar})`;

            const pendingListButton = document.getElementById('pending_list');
            const blockListButton = document.getElementById('block_list');
            const shareProfileButton = document.getElementById('share_profil');
            const pendingModal = document.getElementById('pendingModal');
            const blockModal = document.getElementById('blockModal');
            const closeModalButtons = document.querySelectorAll('.close_modal');

            const cata = document.querySelectorAll('.btn_static_click');
            const hist = document.getElementById('history_bar');
            const arch = document.getElementById('achivements_bar');
            const rank = document.getElementById('rank_bar');

            cata.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove the 'active' class from all cata
                    cata.forEach(btn => btn.classList.remove('active'));
                    
                    // Add the 'active' class to the clicked button
                    button.classList.add('active');
                });
            });
            
            pendingListButton.addEventListener('click', function () {
                pendingModal.style.display = 'flex';
            });

            blockListButton.addEventListener('click', function () {
                blockModal.style.display = 'flex';
            });

            closeModalButtons.forEach(closeButton => {
                closeButton.addEventListener('click', function () {
                    pendingModal.style.display = 'none';
                    blockModal.style.display = 'none';
                });
            });

            window.addEventListener('click', function (event) {
                if (event.target === pendingModal) {
                    pendingModal.style.display = 'none';
                }
                if (event.target === blockModal) {
                    blockModal.style.display = 'none';
                }
            });

            shareProfileButton.addEventListener('click', function () {
                console.log('Share profile clicked');
                let profileUrl = `http://localhost/profile/${username}`;
                navigator.clipboard.writeText(profileUrl);
            });

        } catch (e) {
            console.log(e);
            Router.findRoute('404');
        }
    }
}

export function attachDOM({ username }) {
    console.log('username from profile.js', username);
    document.body.innerHTML = '';
    const page = document.createElement('profile-page');
    page.setAttribute('username', username);
    document.body.appendChild(page);
}

async function getUserData(username) {
    console.log('username from getUserData', username);
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: username })
    }
    let response = await makeAuthRequest('/api/auth/user/', options)

    if (!response.ok) {
        const error = await response.text();
        // alert(error)
        console.log(error);
        throw new Error(error);
    }
    const data = await response.json();

    options.method = 'POST';
    options.body = JSON.stringify({ username: data.username });
    response = await makeAuthRequest('/api/game/get-games', options)
    let games = await response.json();
    // console.log(games);
    data.games = games.games
    console.log('data', data);

    return data;
}



customElements.define('profile-page', Profile);