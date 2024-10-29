// import { navigate } from '../../services/Router.js';
import { Router } from '../../services/Router.js'
import { setupCircleInteractions } from '../../components/circleInteractions.js';
import { setupModal } from '../../components/modal.js';
import { setupChat } from '../../components/chat.js';
import { setupSwitches } from '../../components/switch.js';

window.app = {};
app.router = Router;

document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;
    app.router.findRoute(path);
    setupCircleInteractions();
    setupModal();
    setupChat();
    setupSwitches();
});

const online = document.getElementById('online-btn');
online.addEventListener('click', () => Router.findRoute('/online_game'));

const offline2D = document.getElementById('player-vs-computer-btn');
offline2D.addEventListener('click', () => Router.findRoute('/offline_game'));

const offline3D = document.getElementById('ping-pong-btn');
offline3D.addEventListener('click', () => Router.findRoute('/game_3d'));

const tournament = document.getElementById('tournament-btn');
tournament.addEventListener('click', () => Router.findRoute('/tournament'));