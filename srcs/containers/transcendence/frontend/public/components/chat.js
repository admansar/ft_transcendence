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
            if (!document.querySelector(`#${UserDATA.id}-chat`)) {
                const chat = document.getElementById('chat');
                const div = document.createElement('div');
                const chatform = `
            
                <span class="chat-border" id="${UserDATA.id}-chat">
                    <span class="chat-topic" id="${UserDATA.id}-topic">
                        <span class="message" id="user1" style="color: rgb(38, 38, 38); font-size: 20px; position: absolute;top: -6px; left: 20px;">${UserDATA.id}</span>
                    </span>
                    <span class="chat-close-btn" id="${UserDATA.id}-btn" style="position: absolute; top: 6px; right: 10px; transform: scale(0.7);">&times;</span>
                    <div class="chat-message" id="chatMessages-${UserDATA.id}"></div>
    
                    <div class="chat-under">
                        <span class="import">
                            <input type="text" id="textInput-${UserDATA.id}" placeholder="type here ..." required>
                        </span>
                        <button class="send" id="send-${UserDATA.id}" ></button>
                    </div>
                </span>
            `;
    
                div.innerHTML = chatform;
                chat.appendChild(div);
                const chat_messanger_user = document.querySelector(`#${UserDATA.id}-chat`);
                const chat_messanger_user_close_btn = document.querySelector(`#${UserDATA.id}-btn`);
    
    
                chat_messanger_user_close_btn.addEventListener('click', function () {
                    chat_messanger_user.classList.remove('active');
                    chat_messanger_user.style.display = 'none';
                });
    
                document.querySelector(`#${UserDATA.id}-topic`).addEventListener('click', e => {
                    chat_messanger_user.classList.toggle('active');
                });
                function sendMessage() {
                    const messageText = document.getElementById(`textInput-${UserDATA.id}`).value;
    
                    if (messageText.trim() !== ""){
                        const newMessage = document.createElement('div');
                        newMessage.classList.add('chat-message-user');
                        newMessage.textContent = messageText;
    
                        const chatMessages = document.getElementById(`chatMessages-${UserDATA.id}`);
                        chatMessages.appendChild(newMessage);
    
                        document.getElementById(`textInput-${UserDATA.id}`).value = '';
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }
    
                document.getElementById(`textInput-${UserDATA.id}`).addEventListener('keypress', function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        sendMessage();
                    }
                });
                document.getElementById(`send-${UserDATA.id}`).addEventListener('click', function (event) {
                    sendMessage();
                });
            }
            else { document.querySelector(`#${UserDATA.id}-chat`).style.display = 'flex' }
    
            profile_messanger.addEventListener('click', function () {
                chat_messanger_user.style.display = 'flex';
            });
    
        };
    });
}

export class Chat extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="messanger">
                <div class="messanger-icon">
                    <img src="public/src/img/sms.png">
                </div>
                <div class="messanger-list">
                    <div class="friend-profile" id="Ckannane">
                        <div class="friend-profile-status"></div>
                    </div>
                    <div class="friend-profile" id="User1">
                        <div class="friend-profile-status"></div>
                    </div>
                    <div class="friend-profile" id="User1">
                        <div class="friend-profile-status"></div>
                    </div>
                    <div class="friend-profile" id="User">
                        <div class="friend-profile-status"></div>
                    </div>
                </div>
            </div>
            <div class="sms">
                <span class="chat-border">
                    <span class="chat-topic">
                        <span class="message" id="user1"
                            style="color: rgb(38, 38, 38); font-size: 20px; position: absolute;top: -6px; left: 20px;">User</span>
                    </span>
                    <span class="chat-close-btn"
                        style="position: absolute; top: 6px; right: 10px; transform: scale(0.7);">&times;</span>
        
                    <!-- Container where the messages will appear -->
                    <div class="chat-message" id="chatMessages"></div>
        
                    <div class="chat-under">
                        <span class="import">
                            <!-- Changed input type to "text" -->
                            <input type="text" id="textInput" placeholder="type here ..." required>
                        </span>
                        <button class="folder"></button>
                        <button class="send" onclick="sendMessage()"></button>
                    </div>
                </span>
            </div>
        `
    }
}

customElements.define('app-chat', Chat)