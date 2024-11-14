import { Router } from '../services/Router.js';

export function setupModal() {
    console.log('Setting up modal');
    const playModal = document.getElementById('play-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    
    const online = document.getElementById('online-btn');
    online.addEventListener('click', () => Router.findRoute('/online_game'));

    const offline2D = document.getElementById('player-vs-computer-btn');
    offline2D.addEventListener('click', () => Router.findRoute('/offline_game'));

    const offline3D = document.getElementById('ping-pong-btn');
    offline3D.addEventListener('click', () => Router.findRoute('/game_3d'));

    const tournament = document.getElementById('tournament-btn');
    tournament.addEventListener('click', () => Router.findRoute('/tournament'));
    closeModalBtn.addEventListener('click', () => {
        playModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === playModal) {
            playModal.style.display = 'none';
        }
    });
}

export class Modals extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        setupModal()
    }

    render() {
        this.innerHTML = `
            <div class="modal" id="play-modal">
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <div class="modal-body">
                        <div class="image-container">
                            <img id="mode-image" src="" alt="Game Mode Image" style="display:none;">
                        </div>
                        <div class="buttons-container">
                            <button class="mode-button" data-image="public/src/img/store.png" id="online-btn">Play Online</button>
                            <button class="mode-button" data-image="public/src/img/set.jpeg" id="player-vs-computer-btn">Player vs
                                Computer</button>
                            <button class="mode-button" data-image="public/src/img/inv.png" id="tournament-btn">Tournament</button>
                            <button class="mode-button" data-image="public/src/img/Play image.jpeg" id="ping-pong-btn">3d ping pong game 
                                (beta)</button>
                        </div>
                        <div class="dimention-select">
                            <!-- <button class="small-button" id="switch-1" data-state="on">Play in 2D</button> -->
                            <!-- <button class="small-button" id="switch-2" data-state="off">Play in 3D</button> -->
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

customElements.define('app-modals', Modals);