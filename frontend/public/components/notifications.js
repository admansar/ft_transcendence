class Notifications extends HTMLElement {
    constructor() {
        super();
        this.container = document.createElement('div');
        this.container.className = 'notifications';
        document.body.appendChild(this.container);
    }

    connectedCallback() {
        // app.root.appendChild(this.container);
    }
    
    notify(message, type = 'info', duration = 3000) {
        let errorContainer = document.getElementById('error');
        console.log(message);
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = message;
        errorContainer.appendChild(notification);
        errorContainer.style.display = 'block';
        if (duration) {
            setTimeout(() => {
                errorContainer.textContent = '';
                errorContainer.style.display = 'none';
            }, duration);
        }
    }
}

customElements.define('app-notifications', Notifications);
const notifications = new Notifications();
export default notifications;