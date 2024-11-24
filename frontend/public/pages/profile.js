import notifications from '../components/notifications.js';
import { Router } from '../services/Router.js'
import { makeAuthRequest, sleep } from '../services/utils.js'
import { getMe } from '../services/utils.js'
import { getUserDataByID } from '../services/utils.js'

class Profile extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const username = this.getAttribute('username');
        let userData = await getUserData(username);
        await this.render(username, userData);
        this.checkFriendsStatus(userData);
        await this.renderProfile(userData);
        document.title = `Profile - ${userData.username}`;
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

    async getProfileData(userData) {
        const addFriendButton = document.getElementById('add_friend');

        if (!app.loggedUser) {
            let me = await getMe();
            console.log('me.username', me.username);
        }
        addFriendButton.addEventListener('click', async () => {
            console.log('Add friend clicked');
            const response = await makeAuthRequest('/api/friends/methods/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "status": "ADD",
                    "user_id": String(userData.id)
                })
            })
            const data = await response.json();
            if (response.ok) {
                notifications.notify(data.message, 'success', 1000, addFriendButton);
                addFriendButton.style.display = 'none';
            }
            console.log(data);
        });
    }

    async checkFriendsStatus(userData) {
        const addFriendButton = document.getElementById('add_friend');

        try {
            const res = await makeAuthRequest('/api/friends/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            console.log('Checking pending requests', res);

            if (res.Profile.waiting.includes(userData.id)) {
                const data = await getUserDataByID(userData.id);
                console.log('Friend request pending from', data.username);
                addFriendButton.classList.add('active');
            } else if (res.Profile.friends.includes(userData.id)) {
                addFriendButton.classList.add('active');
            } else if (res.Profile.block.includes(userData.id)) {
                Router.findRoute('/404');
                return;
            }

            return res; // Explicitly return the result
        } catch (err) {
            console.log(err);
            notifications.notify('Error checking friends status', 'error', 1000, addFriendButton);
            throw err; // Ensure the error propagates properly
        }
    }

    async addFriend(userData) {
        const addFriendButton = document.getElementById('add_friend');
        let notif = document.querySelector('.profile-status');
        addFriendButton.addEventListener('click', async () => {
            console.log('Add friend clicked');
            const response = await makeAuthRequest('/api/friends/methods/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "status": "ADD",
                    "user_id": String(userData.id)
                })
            })
            const data = await response.json();
            if (response.ok) {
                notifications.notify(data.message, 'success', 1000, notif);
                addFriendButton.style.display = 'none';
            }
            console.log(data);
        });
    }

    async acceptFriendRequest(userData) {
        const addFriendButton = document.getElementById('add_friend');
        let notif = document.querySelector('.profile-status');
        addFriendButton.addEventListener('click', async () => {
            makeAuthRequest('/api/friends/methods/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "status": "ACCEPT",
                    "user_id": String(userData.id)
                })
            }).then(async res => {
                if (res.ok) {
                    notifications.notify('Friend request accepted', 'success', 1500, notif);
                    addFriendButton.style.display = 'none';
                }
            })
        });
    }

    async blockUser(userData) {
        const blockUserButton = document.getElementById('block_that');
        let notif = document.querySelector('.profile-status');
        blockUserButton.addEventListener('click', async () => {
            makeAuthRequest('/api/friends/methods/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "status": "BLOCK",
                    "user_id": String(userData.id)
                })
            }).then(async res => {
                if (res.ok) {
                    notifications.notify('User blocked', 'success', 1500, notif);
                    blockUserButton.style.display = 'none';
                }
            })
        });
    }

    async rejectFriendRequest(userData) {
        const addFriendButton = document.getElementById('add_friend');
        let notif = document.querySelector('.profile-status');
        addFriendButton.addEventListener('click', async () => {
            makeAuthRequest('/api/friends/methods/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "status": "REJECT",
                    "user_id": String(userData.id)
                })
            }).then(async res => {
                if (res.ok) {
                    notifications.notify('Friend request rejected', 'success', 1500, notif);
                    addFriendButton.style.display = 'none';
                }
            })
        });
    }

    async renderProfile(userData) {
        let me = null;
        const addFriendButton = document.getElementById('add_friend');
        const blockUserButton = document.getElementById('block_that');

        if (!app.loggedUser) {
            me = await getMe();
            console.log('me.username', me.username);
        } else {
            console.log('app.loggedUser', app.loggedUser);
        }
        // console.log('me', app.loggedUser, me.username);
        if (app.loggedUser === userData.username || me.username === userData.username) {
            addFriendButton.style.display = 'none';
            blockUserButton.style.display = 'none';
        } else {
            await this.checkFriendsStatus(userData); // Ensure it completes
            console.log(addFriendButton.classList);

            if (!addFriendButton.classList.contains('active')) {
                await this.addFriend(userData);
            } else {
                await this.rejectFriendRequest(userData);
            }
            this.blockUser(userData);
        }
    }


    async render(username, userData) {
        try {
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
                            <span style="display:contents
                            ">
                                <span class="request_list pending_list" id="pending_list"></span>
                                <span class="request_list block_list" id="block_list"></span>
                            </span>
                            <span style="display:contents">
                                <span class="request_list adding_friend" id="add_friend"></span>
                                <span class="request_list block_user" id="block_that"></span>
                            </span>
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
                                <span class="btn_static_click active" id="history_bar">HISTORY</span>
                                <span class="btn_static_click" id="achivements_bar">ACHIVEMENTS</span>
                                <span class="btn_static_click" id="rank_bar">RANK</span>
                            </div>
                            <div class="HISTORYdata active">
                                ${await this.renderScore(userData)}
                            </div>
                            <div class="ACHIVEMENTSdata">
                                <div class="medal_achivement_bar 5win">
                                    <div class="medal brounz"></div>
                                    <div class="title">WIN 5 Games</div>
                                </div>
                                <div class="medal_achivement_bar 10win">
                                    <div class="medal silver"></div>
                                    <div class="title">WIN 10 Games</div>
                                </div>
                                <div class="medal_achivement_bar 20win">
                                    <div class="medal gold"></div>
                                    <div class="title">WIN 20 Games</div>
                                </div>
                            </div>
                            <div class="RANKYdata">

                                <div class="rank_bar 1" id=USER>
                                    <div class="rank_number"> 1 </div>
                                    <div class="rank_info">
                                        <div class="rank_profile"></div>
                                        <div class="rank_name">USER</div>
                                    </div>
                                    <div class="rank_wins">
                                        <div class="icons_wins"></div>
                                        <div class="numbers_wins">42</div>
                                    </div>
                                </div>

                                <div class="rank_bar 2" id=USER>
                                    <div class="rank_number"> 2 </div>
                                    <div class="rank_info">
                                        <div class="rank_profile"></div>
                                        <div class="rank_name">USER 2</div>
                                    </div>
                                    <div class="rank_wins">
                                        <div class="icons_wins"></div>
                                        <div class="numbers_wins">2</div>
                                    </div>
                                </div>

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
            app.root.profilePicture = avatar.style.backgroundImage = `url(${userData.avatar})`;
            // avatarMenu.style.backgroundImage = `url(${userData.avatar})`;

            const pendingListButton = document.getElementById('pending_list');
            const blockListButton = document.getElementById('block_list');
            const shareProfileButton = document.getElementById('share_profil');
            const pendingModal = document.getElementById('pendingModal');
            const blockModal = document.getElementById('blockModal');
            const closeModalButtons = document.querySelectorAll('.close_modal');

            const cata = document.querySelectorAll('.btn_static_click');
            const hisBar = document.querySelector('.HISTORYdata');
            const rankBar = document.querySelector('.RANKYdata');
            const achBar = document.querySelector('.ACHIVEMENTSdata');

            cata.forEach(button => {
                button.addEventListener('click', function () {
                    // Remove 'active' class from all buttons
                    cata.forEach(btn => btn.classList.remove('active'));

                    // Add 'active' class to the clicked button
                    button.classList.add('active');

                    // Hide all sections
                    hisBar.classList.remove('active');
                    rankBar.classList.remove('active');
                    achBar.classList.remove('active');

                    // Show the relevant section based on the clicked button
                    if (button.id === 'history_bar') {
                        hisBar.classList.add('active');
                    } else if (button.id === 'achivements_bar') {
                        achBar.classList.add('active');
                    } else if (button.id === 'rank_bar') {
                        rankBar.classList.add('active');
                    }
                });
            });
            const add_remove = document.querySelector('.request_list.adding_friend');

            add_remove.addEventListener('click', function () {
                add_remove.classList.add('active');
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
                let shareProfile = document.querySelector('.profile-status');
                notifications.notify('Profile URL copied to clipboard', 'success', 1000, shareProfile);
            });

        } catch (e) {
            console.log(e);
            app.router.findRoute('404');
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