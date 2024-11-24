import { makeAuthRequest } from "../services/utils.js";
import { getUserDataByID } from "../services/utils.js";
import notifications from "./../components/notifications.js";

class NotificationsProfile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    async getAllNotifications() {
        const response = await makeAuthRequest('/api/friends/profile/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        let data = await response.json();
        let pending = data.Profile.waiting;
        return pending;
    }

    async acceptFriendRequest(id) {
        const response = await makeAuthRequest('/api/friends/methods/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "status": "ACCEPT",
                "user_id": String(id)
            })
        })
        let data = await response.json();
        if (response.ok) {
            console.log('Friend request accepted');
        } else {
            console.error(data);
            throw new Error(data);
        }
    }

    render() {
        console.log('NotificationsProfile component is rendered');
        let notificationEl = document.querySelector('.notification-container');
        let notificationList = document.querySelector('.notifications');

        notificationEl.addEventListener('click', async () => {
            let userNotifications = await this.getAllNotifications();
            notificationList.innerHTML = '';
            for (let i = 0; i < userNotifications.length; i++) {
                let notifEl = document.createElement('li');
                notifEl.classList.add('dropdown-item');
                let user = await getUserDataByID(userNotifications[i]);
                console.log('user', user);
                notifEl.innerHTML = `
                    <a href="/profile/${user.username}">
                        <img src="${user.avatar}" alt="${user.username}'s avatar" class="user-avatar" />
                        ${user.username}
                    </a>
                    <button class="accept">Accept</button>
                    <button class="decline">Decline</button>
                `
                notifEl.querySelector('.accept').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    console.log(`Accepted request from ${user.username}`);
                    try {
                        await this.acceptFriendRequest(user.id);
                        notifications.notify('Friend request accepted', 'success', 1000, notificationEl);
                    } catch (e) {
                        console.error(e);
                    }
                    notifEl.remove();
                });
                notifEl.querySelector('.decline').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    console.log(`Declined request from ${user.username}`);
                    notifEl.remove();
                });
                notificationList.appendChild(notifEl);
            }
            notificationList.classList.add('show');
        })
    }
}

customElements.define('app-notifications-profile', NotificationsProfile);