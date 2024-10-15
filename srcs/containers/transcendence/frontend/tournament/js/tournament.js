// // Assuming this script runs after the DOM is fully loaded

// const registerBtn = document.querySelector('.register-btn');

// if (registerBtn) {
//     registerBtn.onclick = () => {
//         alert('Registration form coming soon! Stay tuned for updates.');
//     };
// }

// // Simulating a tournament progress
// const players = document.querySelectorAll('.player');
// let currentRound = 0;
// const rounds = [
//     [0, 2, 1, 3],  // First round winners
//     [0, 2],        // Second round winners
//     [0]            // Final winner
// ];

// function advanceTournament() {
//     if (currentRound < rounds.length) {
//         rounds[currentRound].forEach(index => {
//             if (players[index]) {
//                 players[index].classList.add('winner');
//             }
//         });
//         currentRound++;

//         // When the final round is reached, declare the winner
//         if (currentRound === rounds.length && players[0]) {
//             players[0].textContent = "Player 1";  // You might want to dynamically handle the final winner
//             players[0].classList.add('champion');  // Add a special class for the final winner
//         }
//     }
// }

// // Click anywhere to advance the tournament, but prevent advancing on the register button click
// document.body.onclick = (e) => {
//     if (!registerBtn || e.target !== registerBtn) {
//         advanceTournament();
//     }
// };

const players = [
    document.querySelector('.player1'),
    document.querySelector('.player2'),
    document.querySelector('.player3'),
    document.querySelector('.player4')
]



let room_name = "room_0";
let gameSocket = new WebSocket(`ws://${window.location.host}/ws/tournament/${room_name}/`);

gameSocket.onopen = function () {
    console.log('Connection opened');
}

gameSocket.onmessage = function (e) {
    console.log('Message received');
    let data = JSON.parse(e.data);
    console.log(data);
}

gameSocket.onclose = function (e) {
    console.error('Connection closed');
}

export function tournament() {
    console.log('Tournament page loaded');
    console.log(players);
    players.forEach(player => {
        player.onclick = () => {
            console.log('Player clicked');
            gameSocket.send(JSON.stringify({
                'message': 'Player clicked'
            }));
        }
    });
}