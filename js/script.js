// Scroll
const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + '%';
    progressBar.style.opacity = scrollTop > 10 ? 1 : 0;
});

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

// STAFF + FILTRO
document.addEventListener('DOMContentLoaded', () => {
  const modal     = document.getElementById('staff-modal');
  const closeBtn  = modal.querySelector('.close');
  const avatar    = modal.querySelector('.modal-avatar');
  const nameEl    = modal.querySelector('.modal-name');
  const roleEl    = modal.querySelector('.modal-role');
  const descEl    = modal.querySelector('.modal-description');
  const rolesEl   = modal.querySelector('.modal-roles');
  const locEl     = modal.querySelector('.modal-location');
  const joinedEl  = modal.querySelector('.modal-joined');
  const socialEl  = modal.querySelector('.social-links');

  const cards = document.querySelectorAll('.staff-member');

  // Gestione click sulle card (modal)
  cards.forEach(card => {
    card.addEventListener('click', () => {
      avatar.src           = card.dataset.avatar;
      avatar.alt           = card.dataset.name;
      nameEl.textContent   = card.dataset.name;
      roleEl.textContent   = card.dataset.role;
      descEl.textContent   = card.dataset.description;
      locEl.textContent    = card.dataset.location;
      joinedEl.textContent = card.dataset.joined;

      // Ruoli multipli
      rolesEl.innerHTML = '';
      card.dataset.roles.split(',').forEach(r => {
        const key = r.trim().toLowerCase().replace(/\s+/g,'');
        const span = document.createElement('span');
        span.classList.add('badge', `badge-${key}`);
        span.textContent = r.trim();
        rolesEl.appendChild(span);
      });

      // Link social
      socialEl.innerHTML = '';
      ['instagram','linkedin','twitter','globe'].forEach(key => {
        if (card.dataset[key]) {
          const a = document.createElement('a');
          a.href = card.dataset[key];
          a.target = '_blank';
          a.className = 'social-icon';
          a.innerHTML = key === 'globe'
            ? '<i class="fas fa-globe"></i>'
            : `<i class="fab fa-${key}"></i>`;
          socialEl.appendChild(a);
        }
      });

      modal.style.display = 'flex';
    });
  });

  // Chiudi modal
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // FILTRO CATEGORIE
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // attiva styling
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const roles = card.dataset.roles.split(',').map(r => r.trim());
        if (filter === 'all' || roles.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});