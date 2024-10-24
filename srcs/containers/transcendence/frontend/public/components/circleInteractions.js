export function setupCircleInteractions() {
    const circles = document.querySelectorAll('.circle');
    const container = document.querySelector('.circle-container');

    function handleCircleClick(circle, index) {
        circles.forEach(c => {
            c.classList.remove('active');
            c.style.transform = 'scale(0.5)';
        });

        circle.classList.add('active');

        if (circle.id === 'circle3') {
            const playText = circle.querySelector('.circle-text');
            playText.addEventListener('click', () => {
                document.getElementById('play-modal').style.display = 'block';
            });
        }

        const backgroundImage = circle.getAttribute('data-background');
        document.body.style.backgroundImage = `radial-gradient(circle, rgba(151, 151, 151, 0), rgba(32, 32, 32, 1) 60% 80%), url('${backgroundImage}')`;
        document.body.style.transition = 'all 0.8s ease';

        const circleRect = circle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const circleCenterX = circleRect.left + circleRect.width / 2;
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const offsetX = containerCenterX - circleCenterX;
        container.style.transition = 'transform 0.8s ease-in-out';
        container.style.transform = `translateX(${offsetX}px)`;

        circles.forEach((otherCircle, otherIndex) => {
            if (otherCircle !== circle) {
                let scale = 1 - 0.2 * Math.abs(index - otherIndex);
                if (scale < 0.5) scale = 0.4;
                otherCircle.style.transform = `scale(${1})`;
            } else {
                otherCircle.style.transform = `scale(2)`;
            }
        });
    }

    circles.forEach((circle, index) => {
        circle.addEventListener('click', () => handleCircleClick(circle, index));
    });

    window.addEventListener('load', () => {
        const thirdCircle = circles[2];
        handleCircleClick(thirdCircle, 2);
    });
}
