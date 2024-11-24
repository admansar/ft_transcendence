import { makeAuthRequest } from '../services/utils.js';

class Search extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '';
    }

    connectedCallback() {
        this.render();
    }

    async getAllUsers(user_or_email) {
        const response = await makeAuthRequest('/api/friends/search/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_or_email })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Search results:', data);
        } else {
            console.error(data);
        }
        return data;
    }

    render() {
        console.log('Search component is rendered');

        let searchValue = document.getElementById('search');

        searchValue.addEventListener('keyup', async (e) => {
            let users = await this.getAllUsers(e.target.value);
            let searchResults = document.getElementById('search-results');
            searchResults.innerHTML = '';
            if (e.target.value.length > 0 && users.length > 0) {
                for (let user of users) {
                    console.log(user);
                    searchResults.innerHTML += `
                        <li>
                            <a href="/profile/${user.username}">
                                <img src="${user.avatar}" alt="${user.username}'s avatar" class="user-avatar" />
                                ${user.username}
                            </a>
                        </li>
                    `;
                }
                searchResults.classList.add('show');
            } else {
                searchResults.classList.remove('show');
            }
        });
    }
}

customElements.define('app-search', Search);