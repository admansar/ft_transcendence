class Notifications extends HTMLElement {
    constructor() {
        super();
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        document.body.appendChild(this.container);
    }

    /**
     * Displays a notification message with the specified type and duration.
     * @param {string} message - The notification message to display.
     * @param {string} type - The type of notification (e.g., 'info', 'success', 'warning', 'danger').
     * @param {number} duration - The duration in milliseconds before the notification disappears.
     */
    notify(message, type = 'info', duration = 3000, htmlElement = null) {
        // Create a new notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        if (htmlElement) {
            htmlElement.appendChild(notification);
        } else {
            this.container.appendChild(notification);
        }


        if (duration) {
            setTimeout(() => {
                if (notification.classList.contains('show')) {
                    notification.remove();
                }
            }, duration);
        }

        notification.querySelector('.btn-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

customElements.define('app-notifications', Notifications);
const notifications = new Notifications();
export default notifications;