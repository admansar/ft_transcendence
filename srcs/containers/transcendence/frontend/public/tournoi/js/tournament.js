import { Router } from '../../services/Router.js';

const players = [
    document.querySelector('.player1'),
    document.querySelector('.player2'),
    document.querySelector('.player3'),
    document.querySelector('.player4')
]

const winners = [
    document.querySelector('.winner1'),
    document.querySelector('.winner2'),
]

let register = document.getElementById('register-id');
let data = null;
let room_name = "tour_room";
let token = localStorage.getItem('access');
if (!token)
{
  token = document.cookie;
  token = token.slice(token.indexOf('=') + 1, token.indexOf(';'));
}

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
    (async () => {
        let doc_save = { 'head': document.head.innerHTML, 'body': document.body.innerHTML };
        console.log('game started');
    
        const module = await import('./tournament_game.js');
        const winner = await module.tour_game();
    
        // console.log('Winner:', winner);
        console.log('lets continue the tournament');
        document.head.innerHTML = doc_save.head;
        document.body.innerHTML = doc_save.body;
    })().then(() => {
        console.log('update winners');
        gameSocket.send(JSON.stringify({ 'type': 'get_update'}));
    });
    }
    else if (data.type === 'winners')
    {
        console.log (data)
        for (let i = 0; i < data.winners.length; i++)
            if (i < winners.length)
                winners[i].innerHTML = data.winners[i].winner;
            else
                winners[i].innerHTML = '...';
        for (let i = 0; i < data.players.length; i++)
            if (i < players.length)
                players[i].innerHTML = data.players[i];
            else
                players[i].innerHTML = '...';
    }
}

gameSocket.onclose = function (e) {
    console.error('Connection closed');
}

export function tournament()
{
    if (!token)
    {
        console.alert ('you need to login first');
        Router.findRoute('/login');
    }
    console.log('Tournament page loaded');
}

