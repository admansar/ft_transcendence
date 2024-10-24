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
