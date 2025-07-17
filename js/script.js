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

// Event
document.addEventListener('DOMContentLoaded', function() {
    const eventModal          = document.getElementById('eventModal');
    const closeButton         = eventModal.querySelector('.close-button');
    const modalEventTitle     = document.getElementById('modalEventTitle');
    const modalEventAuthor    = document.getElementById('modalEventAuthor');
    const modalEventDate      = document.getElementById('modalEventDate');
    const modalEventResponses = document.getElementById('modalEventResponses');
    const modalEventViews     = document.getElementById('modalEventViews');
    const modalEventDescription = document.getElementById('modalEventDescription');
    const modalEventCategory  = document.getElementById('modalEventCategory');
    const modalEventLocation  = document.getElementById('modalEventLocation');
    const modalEventActivities = document.getElementById('modalEventActivities');
    const modalEventImage     = document.getElementById('modalEventImage');
    const modalEventJoinLink  = document.getElementById('modalEventJoinLink');

    // --- Nascondi il modal all'avvio ---
    eventModal.style.display = 'none';

    // --- Scroll-to-Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTop');
    window.addEventListener('scroll', function() {
        scrollToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Mobile Menu Toggle ---
    window.toggleMenu = function() {
        const mobileMenu = document.querySelector('.mobile-menu');
        mobileMenu.classList.toggle('active');
    };
    document.addEventListener('click', function(e) {
        const mobileMenu     = document.querySelector('.mobile-menu');
        const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
        if (mobileMenu.classList.contains('active') &&
            !mobileMenuIcon.contains(e.target) &&
            !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // --- Apertura del Modal ---
    document.querySelectorAll('.open-event-modal').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            // Popola i campi
            modalEventTitle.textContent       = this.dataset.title       || 'Dettagli Evento';
            modalEventAuthor.textContent      = this.dataset.author      || 'Autore Sconosciuto';
            modalEventDate.textContent        = this.dataset.date        || 'Data non specificata';
            modalEventResponses.textContent   = this.dataset.responses   || '0';
            modalEventViews.textContent       = this.dataset.views       || '0';
            modalEventDescription.textContent = this.dataset.description || 'Nessuna descrizione disponibile.';
            modalEventCategory.textContent    = this.dataset.category    || 'Categoria non definita';
            modalEventLocation.textContent    = this.dataset.location    || 'Luogo non specificato';

            // Immagine
            modalEventImage.src = this.dataset.imageFull || 'img-events/default.png';
            modalEventImage.alt = this.dataset.title ? `Immagine per ${this.dataset.title}` : 'Immagine Evento';

            // Attività
            modalEventActivities.innerHTML = '';
            try {
                const activities = JSON.parse(this.dataset.activities || '[]');
                if (Array.isArray(activities) && activities.length) {
                    activities.forEach(a => {
                        const li = document.createElement('li');
                        li.innerHTML = `<i class="fas fa-check-circle"></i> ${a}`;
                        modalEventActivities.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = 'Nessuna attività specificata.';
                    modalEventActivities.appendChild(li);
                }
            } catch {
                const li = document.createElement('li');
                li.textContent = 'Errore nel caricamento delle attività.';
                modalEventActivities.appendChild(li);
            }

            // Link di partecipazione
            const joinLink = this.dataset.joinLink;
            if (joinLink && joinLink.trim() && joinLink !== '#') {
                modalEventJoinLink.href          = joinLink;
                modalEventJoinLink.style.display = 'inline-block';
            } else {
                modalEventJoinLink.style.display = 'none';
            }

            // Mostra modal
            eventModal.style.display    = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // --- Chiusura del Modal ---
    closeButton.addEventListener('click', () => {
        eventModal.style.display    = 'none';
        document.body.style.overflow = '';
    });
    window.addEventListener('click', e => {
        if (e.target === eventModal) {
            eventModal.style.display    = 'none';
            document.body.style.overflow = '';
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && eventModal.style.display === 'flex') {
            eventModal.style.display    = 'none';
            document.body.style.overflow = '';
        }
    });
});