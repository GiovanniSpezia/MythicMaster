// Scroll
(function() {
  const progress = document.getElementById('scroll-progress');
  let hideTimer;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    // imposta l'altezza in percentuale
    progress.style.height = pct + '%';
  }

  window.addEventListener('scroll', () => {
    clearTimeout(hideTimer);
    progress.style.opacity = '1'; // mostra
    updateProgress();
    // nascondi dopo 800ms dall'ultimo scroll
    hideTimer = setTimeout(() => {
      progress.style.opacity = '0';
    }, 800);
  });

  // al caricamento, se siamo già a metà pagina
  document.addEventListener('DOMContentLoaded', updateProgress);
})();

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

    // Mostra con animazione dopo 300ms
    setTimeout(() => {
        popup.style.display = 'block';       // Assicura che sia visibile
        popup.classList.add('show-popup');   // Avvia la transizione CSS
    }, 300);

    // Funzione di chiusura
    function closePopup() {
        popup.classList.remove('show-popup');
        popup.classList.add('hide-popup');

        // Al termine della transizione, nasconde del tutto e resetta
        popup.addEventListener('transitionend', () => {
            popup.style.display = 'none';
            popup.classList.remove('hide-popup');
        }, { once: true });
    }

    // Chiusura al click sulla X
    closeBtn.addEventListener('click', closePopup);

    // Chiusura al click esterno
    document.addEventListener('click', e => {
        if (
            popup.classList.contains('show-popup') &&
            !popup.contains(e.target) &&
            e.target !== closeBtn
        ) {
            closePopup();
        }
    });
});