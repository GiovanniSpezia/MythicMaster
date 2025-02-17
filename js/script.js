// >> NavBar
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

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        let popup = document.getElementById("popup");
        popup.classList.add("show-popup");
    }, 2000); // Mostra dopo 15 secondi

    document.getElementById("close-popup").addEventListener("click", function () {
        let popup = document.getElementById("popup");
        popup.style.bottom = "-150px";
        popup.style.opacity = "0";

        setTimeout(function () {
            popup.style.display = "none";
        }, 500);
    });
});