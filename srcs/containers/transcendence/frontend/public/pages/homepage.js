import "../components/circleInteractions.js";
import "../components/modal.js";
import "../components/chat.js";

export class HomePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('Hello Homepage');
        const circlesComponent = document.createElement('app-circles');
        const modalsComponent = document.createElement('app-modals');
        const ChatComponent = document.createElement('app-chat')
        this.appendChild(circlesComponent);
        this.appendChild(modalsComponent);
        this.appendChild(ChatComponent);
    }
}

export async function attachDOM() {
    const page = document.createElement('home-page');
    app.root.innerHTML = ''
    app.root.appendChild(page);
}

customElements.define('home-page', HomePage)