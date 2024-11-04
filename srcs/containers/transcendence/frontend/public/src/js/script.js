// import { navigate } from '../../services/Router.js';
import { Router } from '../../services/Router.js'
import { Circles } from '../../components/circleInteractions.js'
import { setupModal } from '../../components/modal.js';
import { Modals } from '../../components/modal.js';
import { setupChat } from '../../components/chat.js';
import { Chat } from '../../components/chat.js';
import { setupSwitches } from '../../components/switch.js';

window.app = {};
app.router = Router;
app.root = document.getElementById('app');

document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;   
    app.router.findRoute(path);
});
