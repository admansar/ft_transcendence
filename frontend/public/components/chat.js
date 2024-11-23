// import { getwebsocket } from "../services/Router.js";

import { makeAuthRequest } from "../services/utils.js";

// var chatSocket = getwebsocket()
let chatSocket = null;


function front_receive_message(user, message)
{
    front_remove_user(user);
    const chatMessages = document.getElementById(`chatMessages-${user}`);
    if (chatMessages)
    {   
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-message-guest');
        newMessage.textContent = message;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}


function front_remove_user(user)
{
    const messengerList = document.querySelector('.messanger-list');
    if (document.querySelector(`#${user}`))
    {
        console.log('removing user :', user);
        messengerList.removeChild(document.querySelector(`#${user}`));
    }
}

function front_inject_user(user)
{
    makeAuthRequest(`/api/auth/user/${user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async res => {
        res = await res.json();
        console.log(res);
        let avatar = res.avatar;
        console.log('avatar :', avatar);
        const messengerList = document.querySelector('.messanger-list');
        const chat = document.getElementById('chat');
        if (!document.querySelector(`#${user}`))
        {
            console.log('injecting user : ', user);
            messengerList.insertAdjacentHTML('beforeend', `
                    <div class="friend-profile" id="${user}" style="background-image: url(${avatar}); background-size: cover; background-position: center center;" >
                        <div class="friend-profile-status" ></div>
                    </div>
                `);
            const ue = document.querySelector(`#${user} .friend-profile-status`)
            ue.style.backgroundColor = '#00b100';
            if (!document.querySelector(`#${user}-chat`)) {
                const chat = document.getElementById('chat');
                const div = document.createElement('div');
                const chatform = `
            
                <span class="chat-border active" style="display:none" id="${user}-chat">
                    <span class="chat-topic" id="${user}-topic">
                        <span class="message" id="user1" style="color: rgb(38, 38, 38); font-size: 20px; position: absolute;top: -6px; left: 20px;">${user}</span>
                    </span>
                    <span class="chat-close-btn" id="${user}-btn" style="position: absolute; top: 6px; right: 10px; transform: scale(0.7);">&times;</span>
                    <div class="chat-message" id="chatMessages-${user}"></div>
    
                    <div class="chat-under">
                        <span class="import">
                            <input type="text" id="textInput-${user}" placeholder="type here ..." required>
                        </span>
                        <span class="playWith" id="play-with-${user}"></span>
                        <button class="send" id="send-${user}" ></button>
                    </div>
                </span>
                <div class="play-with-moba" id="play-with-${user}-window">
                    <div class="play-with-moba-bar">
                        <div class="message-notif">You are invited to Play with ${user}</div>
                        <div class="profile-pic-play-with"></div>
                        <div class="requeat-play-with">
                            <span class="request accepted" id="${user}-acp">ACCEPT</span>
                            <span class="request rejected" id="${user}-rjt">REJECT</span>
                        </div>
                    </div>
                </div>
            `;
    
                div.innerHTML = chatform;
                chat.appendChild(div);
                const chat_messanger_user = document.querySelector(`#${user}-chat`);
                const chat_messanger_user_close_btn = document.querySelector(`#${user}-btn`);
    
                chat_messanger_user_close_btn.addEventListener('click', function () {
                    chat_messanger_user.classList.remove('active');
                    chat_messanger_user.style.display = 'none';
                });
                document.querySelectorAll('.friend-profile').forEach(friendProfile => {
                    friendProfile.addEventListener('click', (event) => {
                      // Get the user ID from the clicked element's ID
                      const userId = event.target.id;
                  
                      // Find the corresponding chat element
                      const chatElement = document.getElementById(`${userId}-chat`);
                      if (chatElement) {
                        // Set its display to "flex"
                        chatElement.style.display = "flex";
                      }
                    });
                  });
                document.querySelector(`#${user}-topic`).addEventListener('click', e => {
                    chat_messanger_user.classList.toggle('active');
                });
                function sendMessage() {
                    const messageText = document.getElementById(`textInput-${user}`).value;
    
                    if (messageText.trim() !== ""){
                        const newMessage = document.createElement('div');
                        newMessage.classList.add('chat-message-user');
                        newMessage.textContent = messageText;
                        chatSocket.send(JSON.stringify({
                            'type': 'send_message',
                            'message': messageText,
                            'user': user
                        }));
                        const chatMessages = document.getElementById(`chatMessages-${user}`);
                        chatMessages.appendChild(newMessage);
    
                        document.getElementById(`textInput-${user}`).value = '';
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }
    
                document.getElementById(`textInput-${user}`).addEventListener('keypress', function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        sendMessage();
                    }
                });
                const playWithWindow = document.getElementById(`play-with-${user}-window`);
                document.getElementById(`play-with-${user}`).addEventListener('click', function () {
                    console.log("Invite triggered");

                    playWithWindow.style.display = 'flex';
                });


                document.getElementById(`${user}-rjt`).addEventListener('click', function () {
                    playWithWindow.style.display = 'none';
                });

                document.getElementById(`send-${user}`).addEventListener('click', function (event) {
                    sendMessage();
                });
            }
            else { document.querySelector(`#${user}-chat`).style.display = 'flex' }
    
            profile_messanger.addEventListener('click', function () {
                chat_messanger_user.style.display = 'flex';
            });
        }    
    })
}

export function setupChat() {
    const profile_messanger = document.querySelector('.friend-profile');
    const friends = document.querySelector('.messanger-list');
    const sms = document.querySelector('.messanger');
    const sms_icon = document.querySelector('.messanger-icon');
    const chat_messanger_user = document.querySelector('.chat-border');
    sms_icon.addEventListener('click', function () {
        sms.classList.toggle('active');
        sms_icon.classList.toggle('active');
    });

    friends.addEventListener('click', function (e) {
        const UserDATA = e.target.closest('.friend-profile')
        if (UserDATA) {
            console.log("im here");
    
        };
    });
}

export class Chat extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        setupChat();
        socket_impel();
    }

    render() {
        this.innerHTML = `
        <div class="messanger">
        <div class="messanger-icon">
            <img src="public/src/img/sms.png">
        </div>
        <div class="messanger-list">

        </div>
    </div>
    <div class="sms" id="chat"></div>
        `
    }
}

function socket_impel() {
    chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/');

    chatSocket.onopen = function(e) {
        console.log('WebSocket connection established!');
    }

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.type === 'broadcast')
        {
            console.log('broadcasting message');
            let users = data.users;
            for (let i = 0; i < users.length; i++)
            {
                console.log('adding user :', users[i]);
                front_inject_user(users[i]);
            }
        }
        else if (data.type === 'remove_user')
        {
            console.log('removing user :', data.user);
            front_remove_user(data.user);
        }
        else if (data.type === 'send_message')
        {
            console.log('receiving message');
            let user = data.user;
            let message = data.message;
            console.log("iiiiiiiiiihereherehereiiiiiiiiiii")
            console.log(user)
            console.log(message)
            console.log("iiiiiiiiiiiiihereherehereiiiiiiiii")
            front_inject_user(user);
            front_receive_message(user, message);
        }
    }
}
customElements.define('app-chat', Chat)