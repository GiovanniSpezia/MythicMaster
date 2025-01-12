document.querySelector('.discover-button').addEventListener('click', function() {
    window.location.href = '#chi-siamo';
});

function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}