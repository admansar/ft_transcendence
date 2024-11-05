export function setupCircleInteractions() {
    circles.forEach((circle, index) => {
        circle.addEventListener('click', (e) => {
            handleCircleClick(circle, index);
        });
    });
};


const circles = document.querySelectorAll('.circle');
const container = document.querySelector('.circle-container');
const playModal = document.getElementById('play-modal');


function handleCircleClick(circle, index) {
    // Reset scale for all circles
    circles.forEach(c => {
        c.classList.remove('active');
        c.style.transform = 'scale(0.5)';
    });
    
    // Add 'active' class to clicked circle
    circle.classList.add('active');
    
    // Show modal if circle 3 is clicked
    if (circle.id === 'circle3') {
        const playText = circle.querySelector('.circle-text');
        playText.addEventListener('click', () => {
            playModal.style.display = 'block'; // Show modal
        });
    }
    
    // Background image change with fading effect
    const backgroundImage = circle.getAttribute('data-background');
    
    // Step 1: Fade the screen to black
    document.body.classList.add('fade-to-black'); // Apply fade to black class
    
    setTimeout(function () {
        // Step 2: Change the background image after the black fade
        document.body.style.backgroundImage = `radial-gradient(circle, rgba(151, 151, 151, 0), rgba(32, 32, 32, 1) 60% 80%), url('${backgroundImage}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        // Step 3: Fade the screen back to the new background image
        document.body.classList.remove('fade-to-black');
    }, 1000); // Wait for 1 second (matching the fade-out duration)
    
    // Center the clicked circle
    const circleRect = circle.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const offsetX = containerCenterX - circleCenterX;
    container.style.transition = 'transform 0.8s ease-in-out'; // Smooth transition
    container.style.transform = `translateX(${offsetX}px)`;
    
    // Gradually scale other circles
    const activeScale = 2;
    circles.forEach((otherCircle, otherIndex) => {
        if (otherCircle !== circle) {
            const distance = Math.abs(index - otherIndex);
            let scale = 1 - 0.2 * distance;
            if (scale < 0.5) scale = 0.4;
            otherCircle.style.transform = `scale(${1})`;
        } else {
            otherCircle.style.transform = `scale(${activeScale})`;
        }
    });
}

<<<<<<< HEAD
window.addEventListener('load', () => {
    const thirdCircle = circles[2];
    handleCircleClick(thirdCircle, 2);
});

=======
export class Circles extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="circle-container">
                <span class="circle" id="circle1" data-background="public/src/img/store.png">
                    <img src="public/src/img/icons8-shop-60.png" alt="STORE Icon" class="circle-image">
                    <span class="circle-text" style="font-size: 24px;">Store</span>
                    <span class="circle-description">Manage your purchases, Shop some Ball or Paddle skins or buy abilities to use in match</span>
                </span>
                <span class="circle" id="circle2" data-background="public/src/img/inv.png">
                    <img src="public/src/img/Frame 5.png" alt="INVENTORY Icon" class="circle-image">
                    <span class="circle-text" style="font-size: 13px;">INVENTORY</span>
                    <span class="circle-description">Manage your inventory, view your skins and abilities</span>
                </span>
                <span class="circle" id="circle3" data-background="public/src/img/play.png">
                    <img src="public/src/img/icons8-play-60.png" alt="PLAY Icon" class="circle-image">
                    <span class="circle-text" style="font-size: 24px;">PLAY</span>
                    <span class="circle-description">Play against the AI, or play with your friends online</span>
                </span>
                <span class="circle" id="circle4" data-background="public/src/img/archi.jpeg">
                    <img src="public/src/img/Frame 3.png" alt="ACHIEVEMENTS Icon" class="circle-image">
                    <span class="circle-text" style="font-size: 10px;">ACHIEVEMENTS</span>
                    <span class="circle-description">Track your progress, have a look at your achievements, and play more games
                        to unlock more</span>
                </span>
                <span class="circle" id="circle5" data-background="public/src/img/set.jpeg">
                    <img src="public/src/img/Frame 4.png" alt="CONTROL Icon" class="circle-image">
                    <span class="circle-text" style="font-size: 17px;">CONTROL</span>
                    <span class="circle-description">Configure settings, edit your game style settings for a better experience
                        in gameplay</span>
                </span>
            </div>
        `;
        setupCircleInteractions();
    }

    disconnectedCallback() {
        this.innerHTML = '';
    }
}

customElements.define('app-circles', Circles);
>>>>>>> 4887bc03381a1736f9e4e11bf4286d979727a217
