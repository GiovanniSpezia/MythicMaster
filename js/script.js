function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}

// -- Manuale

let currentIndex = 0; // Indice iniziale (rimane sempre 0)
const manuals = document.querySelectorAll('.manuale'); // Manuali
const manualsContainer = document.querySelector('.manual-grid');
const manualWidth = manuals[0].offsetWidth + 20; // Larghezza manuale + margine
const maxIndex = manuals.length - 3; // Calcola massimo indice (3 visibili)

// Funzione per aggiornare la posizione della griglia
function updateGridPosition() {
    manualsContainer.style.transform = `translateX(-${currentIndex * manualWidth}px)`;
}

// Pulsante precedente
document.querySelector('.prev-button').addEventListener('click', () => {
    // Impedisce il movimento a sinistra (oltre il primo manuale)
    if (currentIndex > 0) {
        currentIndex--;
        updateGridPosition();
    }
});

// Pulsante successivo
document.querySelector('.next-button').addEventListener('click', () => {
    // Permette lo scorrimento solo fino a quando non si superano i manuali visibili
    if (currentIndex < maxIndex) {
        currentIndex++;
        updateGridPosition();
    }
});

// Resetta la posizione al caricamento
window.addEventListener('load', () => {
    currentIndex = 0; // Sempre il primo manuale
    updateGridPosition();
});