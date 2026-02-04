// ==============================
// MODAL EVENTI (open-event-modal)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("eventModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".close-button");

  // Campi modal
  const modalEventImage = document.getElementById("modalEventImage");
  const modalEventTitle = document.getElementById("modalEventTitle");
  const modalEventAuthor = document.getElementById("modalEventAuthor");
  const modalEventDate = document.getElementById("modalEventDate");
  const modalEventResponses = document.getElementById("modalEventResponses");
  const modalEventViews = document.getElementById("modalEventViews");
  const modalEventDescription = document.getElementById("modalEventDescription");
  const modalEventCategory = document.getElementById("modalEventCategory");
  const modalEventLocation = document.getElementById("modalEventLocation");
  const modalEventActivities = document.getElementById("modalEventActivities");
  const modalEventJoinLink = document.getElementById("modalEventJoinLink");

  // Helper: parse attività (string JSON in data-activities)
  function parseActivities(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    // raw è stringa: prova JSON
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // fallback: se qualcuno mette "a,b,c"
      return String(raw)
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }
  }

  function openModalFromItem(item) {
    // dataset
    const title = item.dataset.title || "";
    const author = item.dataset.author || "";
    const date = item.dataset.date || "";
    const responses = item.dataset.responses || "0";
    const views = item.dataset.views || "0";
    const description = item.dataset.description || "";
    const category = item.dataset.category || "";
    const location = item.dataset.location || "";
    const imageFull = item.dataset.imageFull || "";
    const joinLink = item.dataset.joinLink || "";
    const extraHtml = item.dataset.extra || ""; // opzionale (es: warning)
    const activities = parseActivities(item.dataset.activities);

    // Popola
    if (modalEventTitle) modalEventTitle.textContent = title;
    if (modalEventAuthor) modalEventAuthor.textContent = author;
    if (modalEventDate) modalEventDate.textContent = date;
    if (modalEventResponses) modalEventResponses.textContent = responses;
    if (modalEventViews) modalEventViews.textContent = views;

    if (modalEventDescription) {
      // Testo base
      modalEventDescription.textContent = description;

      // Extra HTML opzionale (se presente)
      // Se vuoi evitare HTML, commenta queste 3 righe.
      if (extraHtml) {
        const extraWrap = document.createElement("div");
        extraWrap.innerHTML = extraHtml; // inserisce eventuale warning
        modalEventDescription.insertAdjacentElement("afterend", extraWrap);
      }
    }

    if (modalEventCategory) modalEventCategory.textContent = category;
    if (modalEventLocation) modalEventLocation.textContent = location;

    // Immagine
    if (modalEventImage) {
      if (imageFull) {
        modalEventImage.src = imageFull;
        modalEventImage.style.display = "";
      } else {
        modalEventImage.removeAttribute("src");
        modalEventImage.style.display = "none";
      }
    }

    // Attività
    if (modalEventActivities) {
      modalEventActivities.innerHTML = "";
      if (activities.length) {
        activities.forEach(act => {
          const li = document.createElement("li");
          li.innerHTML = `<i class="fa-solid fa-check"></i><span>${act}</span>`;
          modalEventActivities.appendChild(li);
        });
        modalEventActivities.style.display = "";
      } else {
        modalEventActivities.style.display = "none";
      }
    }

    // Link prenotazione
    if (modalEventJoinLink) {
      if (joinLink && joinLink.trim() !== "") {
        modalEventJoinLink.href = joinLink;
        modalEventJoinLink.style.display = "inline-block";
      } else {
        // se non hai link, nascondi il bottone
        modalEventJoinLink.href = "#";
        modalEventJoinLink.style.display = "none";
      }
    }

    // Apri
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
    // pulizia eventuali extra inseriti dopo la descrizione
    // (solo se vuoi evitare accumuli)
    const desc = modalEventDescription;
    if (desc) {
      let next = desc.nextElementSibling;
      // se il next è un wrapper extra (non sempre identificabile), lo rimuoviamo se contiene .event-warning
      if (next && next.querySelector && next.querySelector(".event-warning")) {
        next.remove();
      }
    }
  }

  // Click su eventi (delegation: funziona anche se aggiungi eventi in futuro)
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".open-event-modal");
    if (!item) return;
    e.preventDefault();
    openModalFromItem(item);
  });

  // Chiudi con X
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Chiudi cliccando fuori dal contenuto
  modal.addEventListener("click", (e) => {
    const content = modal.querySelector(".event-modal-content");
    if (content && !content.contains(e.target)) closeModal();
  });

  // Chiudi con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
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

  // Normalizza: "Jr Dev" -> "jrdev", "Developer" -> "developer"
  const norm = (s) => (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');

  // Alias / gruppi: tutto ciò che deve finire sotto "Developer"
  const FILTER_GROUPS = {
    developer: new Set([
      'developer',
      'jrdev',
      'jr dev',
      'juniordev',
      'junior developer',
      'juniordeveloper',
    ].map(norm)),
  };

  // Ritorna i ruoli della card normalizzati (array)
  function getCardRolesNormalized(card) {
    const raw = (card.dataset.roles || '');
    return raw
      .split(',')
      .map(r => norm(r))
      .filter(Boolean);
  }

  // Verifica se una card matcha un filtro (supporta gruppi/alias)
  function cardMatchesFilter(card, filterRaw) {
    const filterKey = norm(filterRaw);

    if (filterKey === 'all') return true;

    const rolesNorm = getCardRolesNormalized(card);

    // Se esiste un gruppo per quel filtro (es: developer include jrdev)
    if (FILTER_GROUPS[filterKey]) {
      const group = FILTER_GROUPS[filterKey];
      return rolesNorm.some(r => group.has(r));
    }

    // Altrimenti match classico: filtro = uno dei ruoli
    return rolesNorm.includes(filterKey);
  }

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

      // Ruoli multipli (badge)
      rolesEl.innerHTML = '';
      (card.dataset.roles || '').split(',').forEach(r => {
        const label = r.trim();
        if (!label) return;

        const key = norm(label); // es: jrdev
        const span = document.createElement('span');
        span.classList.add('badge', `badge-${key}`);
        span.textContent = label;
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

      const filter = btn.dataset.filter; // es: "Developer" o "Jr Dev" o "all"

      cards.forEach(card => {
        card.style.display = cardMatchesFilter(card, filter) ? 'block' : 'none';
      });
    });
  });
});