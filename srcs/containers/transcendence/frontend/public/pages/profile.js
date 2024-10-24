class Profile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TRANCENDENCE</title>
                <link rel="stylesheet" href="public/src/styles/styles.css">
                <link rel="dashbord" href="public/src/styles/dashbord.css">
                <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@700&display=swap" rel="stylesheet">
            </head>
            <body>
                <header>
                    <!-- <div class="header-container"> -->
                        <span class="menu-icon" id="menu-icon">&#9776;
                            <div class="menu-content">
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <br>
                                <li>Item 3</li>
                            </div>
                        </span>
                        <span class="profile"></span>
                        <div></div>
                        <span class="logo">
                            <img src="public/src/img/pingpong-logo.png" alt="LOGO" class="logo-img">
                        </span>
                        <input type="search" placeholder="Search..">
                    <!-- </div> -->
                </header>
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
                            <div class="username-profile-dashbord">USER_name</div>
                            <div class="lvl-profile-dashbord">lvl 100</div>
                            <div class="expbar-profile-dashbord">
                                <div class="user_exp"></div>
                            </div>
                        </div>
                        <div class="match-history-bar">
                            <div class="history-bar">
                                <span class="my_profile_bar" style="border: 2px solid rgb(66, 193, 38);">
                                    <img src="public/src/img/profile.png" style="object-fit: cover; width: 100px; height: 100px;">
                                </span>
                                <span class="score_bar" style="background-color: green;">
                                    <span class="score_main">5</span>
                                    <span class="status">WIN</span>
                                    <span class="score_guest">2</span>
                                </span>
                                <span class="challenger_bar" style="border: 2px solid rgb(193, 38, 38);">
                                    <img src="public/src/img/profile.png" style="object-fit: cover; width: 100px; height: 100px;">
                                </span>
                            </div>
                            <div class="history-bar">
                                <span class="my_profile_bar" style="border: 2px solid rgb(66, 193, 38);">
                                    <img src="public/src/img/profile.png" style="object-fit: cover; width: 100px; height: 100px;">
                                </span>
                                <span class="score_bar" style="background-color: brown;">
                                    <span class="score_main">1</span>
                                    <span class="status">LOSE</span>
                                    <span class="score_guest">4</span>
                                </span>
                                <span class="challenger_bar" style="border: 2px solid rgb(193, 38, 38);">
                                    <img src="public/src/img/profile.png" style="object-fit: cover; width: 100px; height: 100px;">
                                </span>
                            </div>
                            <div class="history-bar">
                                <span class="my_profile_bar" style="border: 2px solid rgb(66, 193, 38);">
                                    <img src="public/src/img/profile.png" style="object-fit: cover; width: 100px; height: 100px;">
                                </span>
                                <span class="score_bar" style="background-color: rgb(190, 175, 42);">
                                    <span class="score_main">1</span>
                                    <span class="status">DRAW</span>
                                    <span class="score_guest">1</span>
                                </span>
                                <span class="challenger_bar" style="border: 2px solid rgb(193, 38, 38);">
                                    <img src="public/src/img/profile.png" style="object-fit: cover; width: 100px; height: 100px;">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="messanger">
                    <div class="messanger-icon">
                        <img src="public/src/img/sms.png">
                    </div>
                    <div class="messanger-list">
                        <div class="friend-profile" id="User">
                            <div class="friend-profile-status"></div>
                        </div>
                        <div class="friend-profile"></div>
                        <div class="friend-profile"></div>
                        <div class="friend-profile"></div>
                        <div class="friend-profile"></div>
                        <div class="friend-profile"></div>
                        <div class="friend-profile"></div>
                        <div class="friend-profile"></div>
                    </div>
                </div>
                <div class="sms">
                    <span class="chat-border">
                        <span class="chat-topic">
                            <span class="message" id="user1" style="color: rgb(38, 38, 38); font-size: 20px; position: absolute;top: -6px; left: 20px;">User</span>
                        </span>
                        <span class="chat-close-btn" style="position: absolute; top: 6px; right: 10px; transform: scale(0.7);">&times;</span>
                        
                        <!-- Container where the messages will appear -->
                        <div class="chat-message" id="chatMessages"></div>
                    
                        <div class="chat-under">
                            <span class="import">
                                <!-- Changed input type to "text" -->
                                <input type="text" id="textInput" placeholder="type here ..." required>
                            </span>
                            <button class="send" onclick="sendMessage()"></button>
                        </div>
                    </span>
                </div>
                <script src="script.js"></script>
            </body>
        </html>
        `
    }
}

export function attachDOM() {
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('style', '');
        document.head.innerHTML = ''
        const page = document.createElement('profile-page');
        document.body.appendChild(page);
    }, 100);
}

customElements.define('profile-page', Profile);