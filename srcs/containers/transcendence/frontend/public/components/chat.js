export function setupChat() {
    const sms = document.querySelector('.messanger');
    const smsIcon = document.querySelector('.messanger-icon');
    const chat_messanger_user = document.querySelector('.chat-border');
    const chat_messanger_user_close_btn = document.querySelector('.chat-close-btn');
    const chat_messanger_user_channel = document.querySelector('.sms');
    const profile_messanger = document.querySelector('.friend-profile');
    const profileMessenger = document.querySelector('.profile');

    smsIcon.addEventListener('click', () => {
        sms.classList.toggle('active');
        smsIcon.classList.toggle('active');
    });

    profileMessenger.addEventListener('click', () => {
        chatMessengerUser.style.display = 'flex';
    });
    
    chat_messanger_user_close_btn.addEventListener('click', function () {
        chat_messanger_user.style.display = 'none';
    });

    profile_messanger.addEventListener('click', function () {
        chat_messanger_user.style.display = 'flex';
    });

    document.querySelector('.chat-topic').addEventListener('click', function () {
        chat_messanger_user.classList.toggle('active');
    });

    function sendMessage() {
        // Get the input value
        var messageText = document.getElementById('textInput').value;

        if (messageText.trim() !== "") {
            // Create a new div for the message
            var newMessage = document.createElement('div');
            newMessage.classList.add('chat-message-user'); // Add message class for styling
            newMessage.textContent = messageText;

            // Append the new message to the chat-message container
            document.getElementById('chatMessages').appendChild(newMessage);

            // Clear the input field after sending the message
            document.getElementById('textInput').value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    document.getElementById('textInput').addEventListener('keypress', function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission or default behavior
            sendMessage(); // Call the sendMessage function
        }
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