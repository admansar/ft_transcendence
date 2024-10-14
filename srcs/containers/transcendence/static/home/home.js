const circles = document.querySelectorAll('.circle');
const container = document.querySelector('.circle-container');

// Function to handle circle click event
function handleCircleClick(circle, index) {
    // Remove the 'active' class from all circles and reset their scale
    circles.forEach(c => {
        c.classList.remove('active');
        c.style.transform = 'scale(1)'; // Reset scale to original size
    });

    // Add the 'active' class to the clicked circle
    circle.classList.add('active');

    // Calculate the position to center the clicked circle
    const circleRect = circle.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const circleCenterX = circleRect.left + circleRect.width / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const offsetX = containerCenterX - circleCenterX;

    // Move the container to center the clicked circle
    container.style.transform = `translateX(${offsetX}px)`;

    // Determine the scale factor for the active circle
    const activeScale = 2;

    // Calculate the distance and adjust the gap dynamically
    circles.forEach((otherCircle, otherIndex) => {
        if (otherCircle !== circle) {
            const distance = Math.abs(index - otherIndex);
            let scale = 1 - 0.2 * distance; // Gradually decrease scale for each distance step
            if (scale < 0.5) scale = 0.5; // Ensure circles don't get too small
            otherCircle.style.transform = `scale(${scale})`;

            // // Adjust the gap based on the scaling
            // const baseGap = 80; // Original gap size
            // const scaledGap = baseGap * (1 / scale); // Adjust gap based on scale
            // container.style.gap = `${scaledGap}px`; // Apply the new gap size
        } else {
            // Scale the clicked (center) circle to be large
            otherCircle.style.transform = `scale(${activeScale})`;
        }
    });
}

// Add event listeners to all circles
circles.forEach((circle, index) => {
    circle.addEventListener('click', () => handleCircleClick(circle, index));
});

// Automatically trigger click on the third circle on page load
window.addEventListener('load', () => {
    const thirdCircle = circles[2]; // Get the third circle (index 2)
    handleCircleClick(thirdCircle, 2);
});
