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

let register = document.querySelector('.Annancement');
let data = null;
let room_name = "tour_room";
let token = null;
let locker = false;

let response = await fetch('http://localhost:8000/api/accounts/me',
  {
    method: 'POST',
    headers: 
    {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }
)

if (response.ok) {
  let data = await response.json();
  // console.log ('full data: ', data)
  token = data.access;
}

let gameSocket = new WebSocket(`ws://${window.location.host}/ws/tournament/?token=${token}`);

gameSocket.onopen = function () {
    console.log('Connection opened');
}

gameSocket.onmessage = function (e) {
    data = JSON.parse(e.data);
    if (data.type === 'usernames')
    {
        for (let i = 0; i < data.player_num; i++)
            if ( i < data.usernames.length)
                players[i].innerHTML = data.usernames[i];
            else
                players[i].innerHTML = '...';
        register.innerHTML = `Waiting for ${data.player_num - data.usernames.length} players`;
        // if (data.usernames.length === data.player_num)
        // {
        // try {document.getElementById("waiter").remove();}catch (e){console.log('No waiter');}
        // }
    }
    else if (data.type === 'start_game')
    {
        console.log('lets start the game');
        console.log('data received: ', data);
    (async () => {
        let doc_save = { 'head': document.head.innerHTML, 'body': document.body.innerHTML };
        console.log('game started');

        const module = await import(`./tournament_game.js?t=${Date.now()}`);
        await module.tour_game(data.self, data.opponent);
        
        // await new Promise((resolve) => {setTimeout(resolve, 5000);});
        console.log('lets continue the tournament');
        document.head.innerHTML = doc_save.head;
        document.body.innerHTML = doc_save.body;
        try {document.getElementById("waiter").remove();}catch (e){console.log('No waiter');}
        for (let i = 0; i < players.length; i++)
            players[i] = document.querySelector('.player' + (i + 1));
        for (let i = 0; i < winners.length; i++)
            winners[i] = document.querySelector('.winner' + (i + 1));
    })().then(() => {
        console.log('update winners');
        if (gameSocket.readyState === WebSocket.OPEN) {
            gameSocket.send(JSON.stringify({ 'type': 'get_update' }));
            console.log('Sent get_update');
        } else {
            console.error('WebSocket is not open. ReadyState:', gameSocket.readyState);
            gameSocket.addEventListener('open', () => {
                gameSocket.send(JSON.stringify({ 'type': 'get_update' }));
                console.log('Sent get_update after reopening');
            });
        }

        // console.log ('sent get_update');
    });
    }
    else if (data.type === 'winners')
    {
        console.log (data)
        for (let i = 0; i < data.winners.length; i++)
            if (i < winners.length)
                if (data.winners[i].winner)
                    winners[i].innerHTML = data.winners[i].winner;
            else
                winners[i].innerHTML = '...';
        for (let i = 0; i < data.players.length; i++)
            if (i < players.length)
                players[i].innerHTML = data.players[i];
            else
                players[i].innerHTML = '...';
        
        if (data.winners.length === 2 && !locker)
        {
            locker = true;
            // console.log('lets start the championship');
            gameSocket.send(JSON.stringify(
                {
                    'type': 'start_championship',
                    'self': data.winners[0].winner,
                    'opponent': data.winners[1].winner
                }));
        }
        else if (data.winners.length === 3)
        {
            console.log ('the champion chep is : ', data.winners)
            let win = document.getElementById('champion');
            win.innerHTML = data.winners[2].winner;
        }
    }
    // else if (data.type === 'winner_winner_chicken_dinner')
    // {
    //   // show_notification(`${data.winner} wins the game!`);
    //   console.log ('the champion chep is : ', data.champion)
    //   win = document.getElementById('champion');
    //   win.innerHTML = data.champion;
    //   // winner = data.winner;
    //   // breaker = 1;
    //   // gameSocket.close();
    // }
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

