import { Router } from '../../services/Router.js'
import app from '../../components/state.js';

// window.app = {};
// app.router = Router;
// app.root = document.getElementById('app');
document.addEventListener('userDataReady', () => {
    const userData = app.state.loggedUser
    console.log('User data in other component:', userData);

});
window.addEventListener('userDataReady', () => {
    const userData = app.state.loggedUser
    console.log('User data in other component:', userData);

});
document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;   
    app.router.findRoute(path);
});

