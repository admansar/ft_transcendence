const WebSocket = require('ws');

const socket = new WebSocket('ws://127.0.0.1/ws/game/room_1/');

socket.on('open', () => {
    console.log('WebSocket connection established');
    socket.send('Hello Server!');
});

socket.on('message', (data) => {
    console.log(`Received: ${data}`);
});

socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
});

socket.on('close', () => {
    console.log('WebSocket connection closed');
});

