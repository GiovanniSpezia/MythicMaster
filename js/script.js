function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}

// -- Manuale

let currentIndex = 0;
const manualGrid = document.querySelector('.manual-grid');
const manualItems = document.querySelectorAll('.manuale');
const totalItems = manualItems.length;
const itemsToShow = 3; // Mostra 3 manuali per volta
const itemWidth = manualItems[0].offsetWidth + 30; // Larghezza di ogni manuale + margine

// Funzione per aggiornare la posizione della griglia
const updateGridPosition = () => {
    const offset = -currentIndex * itemWidth; // Calcola il movimento in base all'indice
    manualGrid.style.transform = `translateX(${offset}px)`;
};

// Funzione per gestire la freccia "next"
document.querySelector('.next-button').addEventListener('click', () => {
    if (currentIndex < totalItems - itemsToShow) {
        currentIndex++;
        updateGridPosition();
    }
});

// Funzione per gestire la freccia "prev"
document.querySelector('.prev-button').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateGridPosition();
    }
});