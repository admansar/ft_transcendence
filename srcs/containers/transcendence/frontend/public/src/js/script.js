import { navigate } from './router.js';

const circles = document.querySelectorAll('.circle');
const container = document.querySelector('.circle-container');
const playModal = document.getElementById('play-modal'); // Get the modal element
const closeModalBtn = document.querySelector('.close-btn'); // Close button inside modal
const modeImage = document.getElementById('mode-image'); // Image container for game mode
const modeButtons = document.querySelectorAll('.mode-button'); // All game mode buttons
const buttons = document.querySelectorAll('.mode-button');
const switch1 = document.getElementById('switch-1');
const switch2 = document.getElementById('switch-2');

import { Router } from '../../services/Router.js';
import { routes } from '../../services/Router.js';

window.app = {}
app.router = Router;

document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;
    console.log(path);
    app.router.findRoute(path);
})

let jwt = localStorage.getItem('access');


function handleCircleClick(circle, index) {
    // Reset scale for all circles
    circles.forEach(c => {
        c.classList.remove('active');
        c.style.transform = 'scale(0.5)';
    });

    // Add 'active' class to clicked circle
    circle.classList.add('active');

    if (circle.id === 'circle3') {
        const playText = circle.querySelector('.circle-text');
        playText.addEventListener('click', () => {
            playModal.style.display = 'block'; // Show modal
        });
    }
    // Update the background image based on the clicked circle
    // const imgs = ["src/store.png", "src/inv.png", "src/Play image.jpeg", "src/archi.jpeg", "src/set.jpeg"];
    const backgroundImage = circle.getAttribute('data-background');

    document.body.style.backgroundImage = `radial-gradient(circle, rgba(151, 151, 151, 0), rgba(32, 32, 32, 1) 60% 80%), url('${backgroundImage}')`;
    document.body.style.backgroundSize = 'cover'; // Make sure the background covers the whole page
    document.body.style.backgroundPosition = 'center'; // Center the background image
    document.body.style.transition = 'all 0.8s ease'; // Smooth transition for background change

    // Center the clicked circle

    const circleRect = circle.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const offsetX = containerCenterX - circleCenterX;
    container.style.transition = 'transform 0.8s ease-in-out'; // Smooth transition
    container.style.transform = `translateX(${offsetX}px)`;
    // Gradually scale other circles
    const activeScale = 2;
    circles.forEach((otherCircle, otherIndex) => {
        if (otherCircle !== circle) {
            const distance = Math.abs(index - otherIndex);
            let scale = 1 - 0.2 * distance;
            if (scale < 0.5) scale = 0.4;
            otherCircle.style.transform = `scale(${1})`;
        } else {
            otherCircle.style.transform = `scale(${activeScale})`;
        }
    });

    // {
    //     const middle_circle = document.querySelectorAll('.circle')[2];
    //     const mid_pos = middle_circle.getBoundingClientRect().left + (middle_circle.getBoundingClientRect().width / 2);
    //     const current_circle_left = circle.getBoundingClientRect().left + (circle.getBoundingClientRect().width / 2);
    //     const difference = Math.abs(mid_pos - (current_circle_left));
    //     container.style.transform = `translateX(${
    //         mid_pos > current_circle_left ? difference : -difference
    //     }px)`
    //     circle.style.transform = `scale(2)`
    //     console.log("diff", difference, "center:" ,mid_pos, "right:", current_circle_left);

    // }
}



// modeButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const imageSrc = button.getAttribute('data-image'); // Get the image src from data attribute
//         modeImage.src = imageSrc; // Set the new image
//         modeImage.style.display = 'block'; // Ensure the image is visible
//         modeImage.style.transition = 'transform 0.8s ease';
//     });
// });

circles.forEach((circle, index) => {
    circle.addEventListener('click', (e) => {
        handleCircleClick(circle, index);
    });
});

window.addEventListener('load', () => {
    const thirdCircle = circles[2];
    handleCircleClick(thirdCircle, 2);
});

closeModalBtn.addEventListener('click', () => {
    playModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === playModal) {
        playModal.style.display = 'none';
    }
});

function toggleSwitch(selectedSwitch, otherSwitch) {

    selectedSwitch.setAttribute('data-state', 'on');
    selectedSwitch.style.backgroundColor = '#FBCC0A';

    otherSwitch.setAttribute('data-state', 'off');
    otherSwitch.style.backgroundColor = '#383838';
}

switch1.addEventListener('click', () => toggleSwitch(switch1, switch2));
switch2.addEventListener('click', () => toggleSwitch(switch2, switch1));

document.getElementById('menu-icon').addEventListener('click', function () {
    const content = document.getElementById('menu-content');
    if (content.style.display === 'block') {
        content.style.display = 'none'; // Hide content
    } else {
        content.style.display = 'block'; // Show content
    }
});

const sms = document.querySelector('.messanger');
const sms_icon = document.querySelector('.messanger-icon')

sms_icon.addEventListener('click', function () {
    sms.classList.toggle('active');
    sms_icon.classList.toggle('active');
});

const menu = document.querySelector('.menu-icon');

menu.addEventListener('click', () => {
    menu.classList.toggle('active');
});

const chat_messanger_user = document.querySelector('.chat-border');
const chat_messanger_user_close_btn = document.querySelector('.chat-close-btn');
const chat_messanger_user_channel = document.querySelector('.sms');
const profile_messanger = document.querySelector('.profile');

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

// window.onload = function() {
//     if (jwt == null && window.location.pathname !== '/login') {
//         window.location.href = '/login';
//     }
// };



const online = document.getElementById('online-btn');

online.addEventListener('click', function () {
    navigate('/game_2d');
});

const offline_2d = document.getElementById('player-vs-computer-btn');

offline_2d.addEventListener('click', function () {
    navigate('/game_offline_2d');
});

const offline_3d = document.getElementById('player-vs-player-btn');

offline_3d.addEventListener('click', function () {
    navigate('/game_3d');
});

const tournament = document.getElementById('tournament-btn');

tournament.addEventListener('click', function () {
    navigate('/tournament');
});