export class Menu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const menuIcon = document.getElementById('menu-icon');
        const content = document.querySelector('.menu-content');
        
        menuIcon.addEventListener('click', function (event) {
            menuIcon.classList.toggle('active'); 
        
            if (menuIcon.classList.contains('active')) {
                content.style.maxHeight = '500px'; 
                content.style.opacity = '1'; 
                content.style.overflow = 'visible'; 
            } else {
                closeMenu();
            }
        
            event.stopPropagation(); 
        });
        

        content.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        

        document.addEventListener('click', function () {
            if (menuIcon.classList.contains('active')) {
                closeMenu();
            }
        });
        
        function closeMenu() {
            menuIcon.classList.remove('active'); 
            content.style.maxHeight = '0'; 
            content.style.opacity = '0';
            content.style.overflow = 'hidden'; 
        }
        
    }
}

customElements.define('app-menu', Menu);
