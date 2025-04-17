// NavBar
function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}

// Scroll-to-Top Button Logic
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Show or hide the button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to the top when the button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Pop-up

document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-popup');

    // Mostra con animazione
    setTimeout(() => {
        popup.classList.add('show-popup');
    }, 300);

    // Chiusura animata
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show-popup');
        popup.classList.add('hide-popup');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    });
});
