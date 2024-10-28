const players = [
    document.querySelector('.player1'),
    document.querySelector('.player2'),
    document.querySelector('.player3'),
    document.querySelector('.player4')
]

let register = document.getElementById('register-id');
let data = null;
let room_name = "tour_room";
let winners = [];
const token = localStorage.getItem('jwtToken');
let gameSocket = new WebSocket(`ws://${window.location.host}/ws/tournament/?token=${token}`);

gameSocket.onopen = function () {
    console.log('Connection opened');
}

gameSocket.onmessage = function (e) {
    console.log('Message received');
    data = JSON.parse(e.data);
    console.log("the type of this data is : ", data.type);
    if (data.type === 'usernames')
    {
        for (let i = 0; i < data.player_num; i++)
            if ( i < data.usernames.length)
                players[i].innerHTML = data.usernames[i];
            else
                players[i].innerHTML = '...';
        register.innerHTML = `waiting for ${data.player_num - data.usernames.length} players`;
    }
    else if (data.type === 'start_game') {
        console.log('game started');
        import('./tournament_game.js').then(module => {
            module.tour_game().then(winner => {
                console.log('Winner:', winner);
            });
        });
    }
}

gameSocket.onclose = function (e) {
    console.error('Connection closed');
}

export function tournament() {
    console.log('Tournament page loaded');
    
}

