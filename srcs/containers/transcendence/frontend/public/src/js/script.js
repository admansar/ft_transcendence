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

// const online = document.getElementById('online-btn');
// online.addEventListener('click', () => navigate('/game_2d'));

// const offline2D = document.getElementById('player-vs-computer-btn');
// offline2D.addEventListener('click', () => navigate('/game_offline_2d'));

// const offline3D = document.getElementById('player-vs-player-btn');
// offline3D.addEventListener('click', () => navigate('/game_3d'));

// const tournament = document.getElementById('tournament-btn');
// tournament.addEventListener('click', () => navigate('/tournament'));