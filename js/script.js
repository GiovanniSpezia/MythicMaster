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
document.addEventListener('DOMContentLoaded', function(){
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileListLinks = mobileMenu.querySelectorAll('a');
  const mobileHasDropdownBtns = mobileMenu.querySelectorAll('.mobile-dropdown-toggle');

  function openMobile(){
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden','false');
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile(){
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden','true');
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  mobileToggle.addEventListener('click', function(e){
    if(mobileMenu.classList.contains('active')) closeMobile(); else openMobile();
  });
  mobileMenu.addEventListener('click', function(e){
    if(e.target === mobileMenu) closeMobile();
  });
  mobileListLinks.forEach(link=>{
    link.addEventListener('click', function(){ closeMobile(); });
  });
  mobileHasDropdownBtns.forEach(btn=>{
    btn.addEventListener('click', function(){
      const parent = btn.parentElement;
      parent.classList.toggle('open');
      const expanded = parent.classList.contains('open');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  });

  const ddToggle = document.querySelector('.desktop-menu .dropdown-toggle');
  const ddMenu = document.getElementById('dd-submenu');
  if(ddToggle){
    ddToggle.addEventListener('click', function(e){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    ddToggle.addEventListener('keydown', function(e){
      if(e.key === 'ArrowDown'){ e.preventDefault(); const first = ddMenu.querySelector('a'); if(first) first.focus(); }
      if(e.key === 'Escape'){ this.setAttribute('aria-expanded','false'); this.focus(); }
    });
  }

  document.addEventListener('click', function(e){
    const desktopHas = document.querySelector('.desktop-menu .has-dropdown');
    if(desktopHas && !desktopHas.contains(e.target)){
      const dt = desktopHas.querySelector('.dropdown-toggle');
      if(dt) dt.setAttribute('aria-expanded','false');
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(mobileMenu.classList.contains('active')) closeMobile();
      const desktopHas = document.querySelector('.desktop-menu .has-dropdown .dropdown-toggle');
      if(desktopHas) desktopHas.setAttribute('aria-expanded','false');
    }
  });
});

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

// Cookie
document.addEventListener("DOMContentLoaded", function() {
    const tab = document.getElementById("cookie-tab");
    const popup = document.getElementById("cookie-popup");
    const preferences = document.getElementById("cookie-preferences");

    const acceptAll = document.getElementById("accept-all");
    const rejectAll = document.getElementById("reject-all");
    const customizeBtn = document.getElementById("customize-btn");
    const savePreferences = document.getElementById("save-preferences");
    const cancelPreferences = document.getElementById("cancel-preferences");

    // Apri/chiudi popup
    tab.addEventListener("click", () => {
        popup.style.display = (popup.style.display === "block") ? "none" : "block";
        preferences.style.display = "none";
    });

    // Accetta tutti
    acceptAll.addEventListener("click", () => {
        saveConsent({ functional: true, analytics: true, marketing: true });
        popup.style.display = "none";
    });

    // Rifiuta tutti
    rejectAll.addEventListener("click", () => {
        saveConsent({ functional: true, analytics: false, marketing: false });
        popup.style.display = "none";
    });

    // Apri personalizzazione
    customizeBtn.addEventListener("click", () => {
        popup.style.display = "none";
        preferences.style.display = "block";
    });

    // Salva preferenze
    savePreferences.addEventListener("click", () => {
        const analytics = document.getElementById("analytics").checked;
        const marketing = document.getElementById("marketing").checked;
        saveConsent({ functional: true, analytics, marketing });
        preferences.style.display = "none";
    });

    // Annulla
    cancelPreferences.addEventListener("click", () => {
        preferences.style.display = "none";
    });

    // Funzione di salvataggio + invio al server (per IP)
    function saveConsent(consent) {
        localStorage.setItem("cookiesConsent", JSON.stringify(consent));

        // Se vuoi salvarlo anche lato server con IP:
        fetch("/save-consent.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(consent)
        });
    }
});

// Dice Roller
document.addEventListener("DOMContentLoaded", () => {
    const diceButtons = document.querySelectorAll(".dice-buttons button");
    const diceResult = document.getElementById("diceResult");
    const historyList = document.getElementById("historyList");
    const totalDisplay = document.getElementById("total");
    const rollAgainBtn = document.getElementById("rollAgain");
    const numRollsInput = document.getElementById("numRolls");

    let history = [];
    let currentDice = 6;

    function rollDice(sides, times = 1) {
        let results = [];
        for (let i = 0; i < times; i++) {
            results.push(Math.floor(Math.random() * sides) + 1);
        }
        return results;
    }

    function createSparkles() {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement("div");
            sparkle.classList.add("sparkle");
            sparkle.style.background = Math.random() > 0.5 ? "#FFD700" : "#c470ff";
            sparkle.style.left = `${50 + (Math.random() * 120 - 60)}%`;
            sparkle.style.top = `${50 + (Math.random() * 80 - 40)}%`;
            diceResult.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
        }
    }

    function updateUI(results, diceType) {
        // Animazione
        diceResult.classList.remove("roll");
        void diceResult.offsetWidth; 
        diceResult.classList.add("roll");

        const sum = results.reduce((a, b) => a + b, 0);
        diceResult.textContent = `${results.join(" + ")} = ${sum}`;

        // Scintille decorative
        createSparkles();

        // Storico
        history.unshift({ text: `${results.join(" + ")} = ${sum}`, type: `d${diceType}` });
        if (history.length > 10) history.pop();

        historyList.innerHTML = history.map(r => 
            `<li>${r.text}<span class="badge">${r.type}</span></li>`
        ).join("");

        totalDisplay.textContent = `Totale complessivo: ${history.reduce((acc, h) => {
            const match = h.text.match(/= (\d+)/);
            return acc + (match ? parseInt(match[1]) : 0);
        }, 0)}`;
    }

    diceButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentDice = parseInt(btn.dataset.dice);
            const times = parseInt(numRollsInput.value) || 1;
            const results = rollDice(currentDice, times);
            updateUI(results, currentDice);
        });
    });

    rollAgainBtn.addEventListener("click", () => {
        const times = parseInt(numRollsInput.value) || 1;
        const results = rollDice(currentDice, times);
        updateUI(results, currentDice);
    });
});