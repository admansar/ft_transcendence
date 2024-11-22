export class Menu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        console.log("I'm here in menu");

        // Select the menu icon by its ID
        const menuIcon = document.getElementById('menu-icon');

        // Add the click event listener to toggle menu content visibility
        menuIcon.addEventListener('click', function () {
            const content = menuIcon.querySelector('.menu-content');
            menuIcon.classList.toggle('active'); // Toggle the active class

            if (menuIcon.classList.contains('active')) {
                content.style.maxHeight = '500px'; // Ensure the content is fully visible
                content.style.opacity = '1'; // Make the content visible
            } else {
                content.style.maxHeight = '0'; // Hide content
                content.style.opacity = '0'; // Fade out the content
            }
        });
    }
}

customElements.define('app-menu', Menu);
