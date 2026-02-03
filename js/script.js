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