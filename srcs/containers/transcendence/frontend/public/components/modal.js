export function setupModal() {
    const playModal = document.getElementById('play-modal');
    const closeModalBtn = document.querySelector('.close-btn');

    closeModalBtn.addEventListener('click', () => {
        playModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === playModal) {
            playModal.style.display = 'none';
        }
    });
}
