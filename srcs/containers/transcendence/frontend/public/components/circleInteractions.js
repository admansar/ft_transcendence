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

window.addEventListener('load', () => {
    const thirdCircle = circles[2];
    handleCircleClick(thirdCircle, 2);
});

