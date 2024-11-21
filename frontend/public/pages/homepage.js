import "../components/circleInteractions.js";
import "../components/modal.js";
import "../components/chat.js";
import "../components/settings.js"
import "../components/search.js";
import { getUserDataByID } from "../services/utils.js";
import { getToken } from "../services/utils.js";
import app from "../components/state.js";

export class HomePage extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        let profile = document.querySelector('.profile');
        let jwt = await getToken();
        let userData = await getUserDataByID(jwt.id);
        
        app.setUserData(userData);
        app.state.loggedUser = userData.username;
        console.log('loggedUser from Homepage', app.state.loggedUser);
        console.log('app.userData from Homepage', app.getUserData());
        document.dispatchEvent(new Event('userDataReady'));
        // let event = new CustomEvent('userDataReady', {
        //     detail: {
        //         userData
        //     }
        // });
        // window.dispatchEvent(event);
        
        profile.style.backgroundImage = `url(${userData.avatar})`;
        profile.addEventListener('click', e => {
            e.preventDefault();
            app.router.findRoute(`/profile/${userData.username}`);
        })
        const circlesComponent = document.createElement('app-circles');
        const modalsComponent = document.createElement('app-modals');
        const ChatComponent = document.createElement('app-chat');
        const SettingsComponent = document.createElement('app-settings');
        this.appendChild(SettingsComponent);
        this.appendChild(circlesComponent);
        this.appendChild(modalsComponent);
        this.appendChild(ChatComponent);

        const searchComponent = document.createElement('app-search');
        this.appendChild(searchComponent);

    }
}

export async function attachDOM() {
    const page = document.createElement('home-page');
    app.root.innerHTML = ''
    app.root.appendChild(page);
}

customElements.define('home-page', HomePage)