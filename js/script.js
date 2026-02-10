// Cookie
(() => {
  // ====== CONFIG ======
  const STORAGE_KEY = "mm_cookie_consent_v1";
  const COOKIE_NAME  = "mm_cookie_consent";
  const COOKIE_DAYS  = 180; // 6 mesi

  // ====== DOM ======
  const tab         = document.getElementById("cookie-tab");
  const popup       = document.getElementById("cookie-popup");
  const prefs       = document.getElementById("cookie-preferences");

  const acceptAll   = document.getElementById("accept-all");
  const rejectAll   = document.getElementById("reject-all");
  const customizeBtn= document.getElementById("customize-btn");

  const savePrefs   = document.getElementById("save-preferences");
  const cancelPrefs = document.getElementById("cancel-preferences");

  const analyticsCb = document.getElementById("analytics");
  const marketingCb = document.getElementById("marketing");

  if (!tab || !popup || !prefs) return;

  // ====== HELPERS (cookie + storage) ======
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    const n = name + "=";
    const decoded = decodeURIComponent(document.cookie || "");
    const parts = decoded.split(";");
    for (let p of parts) {
      p = p.trim();
      if (p.indexOf(n) === 0) return p.substring(n.length);
    }
    return null;
  }

  function saveConsent(obj) {
    const payload = {
      ...obj,
      updatedAt: Date.now(),
      v: 1
    };
    const str = JSON.stringify(payload);
    try { localStorage.setItem(STORAGE_KEY, str); } catch {}
    setCookie(COOKIE_NAME, str, COOKIE_DAYS);
  }

  function loadConsent() {
    // 1) prova localStorage
    try {
      const ls = localStorage.getItem(STORAGE_KEY);
      if (ls) return JSON.parse(ls);
    } catch {}

    // 2) fallback cookie
    try {
      const ck = getCookie(COOKIE_NAME);
      if (ck) return JSON.parse(ck);
    } catch {}

    return null;
  }

  function isValidConsent(c) {
    return c && typeof c === "object" && typeof c.necessary === "boolean";
  }

  // ====== UI ======
  function show(el) { el.style.display = "block"; }
  function hide(el) { el.style.display = "none"; }

  function closeAllPopups() {
    hide(popup);
    hide(prefs);
  }

  function openMainPopup() {
    hide(prefs);
    show(popup);
  }

  function openPreferences() {
    hide(popup);
    show(prefs);
  }

  function syncCheckboxesFromConsent(consent) {
    // necessary sempre true (non disattivabile)
    analyticsCb.checked = !!consent.analytics;
    marketingCb.checked = !!consent.marketing;
  }

  // ====== APPLY (qui agganci eventuali script) ======
  function applyConsent(consent) {
    // Esempio: se vuoi bloccare/attivare analytics o marketing,
    // qui puoi iniettare script solo se consent.analytics/marketing è true.
    //
    // Per ora: niente iniezioni automatiche (sicuro e pulito).
    // Puoi dirmi che servizi usi (GA4, Meta Pixel, ecc.) e te lo integro.
  }

  // ====== INIT ======
  const existing = loadConsent();

  if (isValidConsent(existing)) {
    // già scelto → non mostrare popup
    syncCheckboxesFromConsent(existing);
    applyConsent(existing);
    closeAllPopups();
  } else {
    // prima visita → mostra popup
    openMainPopup();
  }

  // ====== EVENTS ======
  tab.addEventListener("click", () => {
    // toggle popup principale (se prefs aperte chiude quelle)
    if (prefs.style.display === "block") {
      openMainPopup();
      return;
    }
    if (popup.style.display === "block") closeAllPopups();
    else openMainPopup();
  });

  acceptAll?.addEventListener("click", () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    saveConsent(consent);
    syncCheckboxesFromConsent(consent);
    applyConsent(consent);
    closeAllPopups();
  });

  rejectAll?.addEventListener("click", () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    saveConsent(consent);
    syncCheckboxesFromConsent(consent);
    applyConsent(consent);
    closeAllPopups();
  });

  customizeBtn?.addEventListener("click", () => {
    // se non esiste ancora scelta, apri prefs con default off
    const current = loadConsent();
    const base = isValidConsent(current)
      ? current
      : { necessary: true, analytics: false, marketing: false };

    syncCheckboxesFromConsent(base);
    openPreferences();
  });

  savePrefs?.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: !!analyticsCb.checked,
      marketing: !!marketingCb.checked
    };
    saveConsent(consent);
    applyConsent(consent);
    closeAllPopups();
  });

  cancelPrefs?.addEventListener("click", () => {
    // torna al popup principale senza salvare
    openMainPopup();
  });

  // click fuori = chiude (opzionale)
  document.addEventListener("click", (e) => {
    const isClickInside =
      popup.contains(e.target) ||
      prefs.contains(e.target) ||
      tab.contains(e.target);
    if (!isClickInside) closeAllPopups();
  });
})();

// CLIENTI E COLLABORAZIONI

// ====== CLIENTI SLIDER (drag + dots + snap) ======
(() => {
  const slider = document.querySelector(".clienti-slider");
  const track  = document.querySelector(".clienti-track");
  const dotsWrap = document.querySelector(".slider-dots");

  if (!slider || !track || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll(".cliente-card"));
  if (cards.length === 0) return;

  // Motion preference
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let currentIndex = 0;
  let isDown = false;
  let startX = 0;
  let startTranslate = 0;
  let currentTranslate = 0;

  let autoplayTimer = null;
  let userInteracted = false;

  // Helpers
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const getGap = () => {
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap || "0");
    return isNaN(gap) ? 0 : gap;
  };

  const cardStep = () => {
    const gap = getGap();
    const w = cards[0].getBoundingClientRect().width;
    return w + gap;
  };

  const maxIndex = () => cards.length - 1;

  const maxTranslate = () => 0;
  const minTranslate = () => {
    // quanto posso andare a sinistra per mostrare l'ultima card senza "spazio vuoto"
    const step = cardStep();
    return -step * maxIndex();
  };

  const setTranslate = (x, smooth = true) => {
    currentTranslate = clamp(x, minTranslate(), maxTranslate());
    if (smooth && !reduceMotion) track.style.transition = "transform .45s cubic-bezier(.22,.8,.2,1)";
    if (!smooth) track.style.transition = "none";
    track.style.transform = `translateX(${currentTranslate}px)`;
  };

  const snapToIndex = (index) => {
    currentIndex = clamp(index, 0, maxIndex());
    const step = cardStep();
    setTranslate(-step * currentIndex, true);
    setActiveDot(currentIndex);
  };

  // Dots
  const dots = [];
  const buildDots = () => {
    dotsWrap.innerHTML = "";
    dots.length = 0;

    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Vai al cliente ${i + 1}`);
      b.addEventListener("click", () => {
        userInteracted = true;
        stopAutoplay();
        snapToIndex(i);
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    setActiveDot(currentIndex);
  };

  const setActiveDot = (i) => {
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  };

  // Drag / swipe
  const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const onDown = (e) => {
    isDown = true;
    userInteracted = true;
    stopAutoplay();

    track.classList.add("is-dragging");
    startX = pointerX(e);
    startTranslate = currentTranslate;
    track.style.transition = "none";
  };

  const onMove = (e) => {
    if (!isDown) return;
    const x = pointerX(e);
    const dx = x - startX;
    setTranslate(startTranslate + dx, false);
  };

  const onUp = () => {
    if (!isDown) return;
    isDown = false;

    track.classList.remove("is-dragging");

    // trova indice più vicino
    const step = cardStep();
    const idx = Math.round(Math.abs(currentTranslate) / step);
    snapToIndex(idx);
  };

  // Event listeners (mouse + touch)
  slider.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  slider.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onUp);

  // Prevent image drag default
  track.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
  });

  // Keyboard
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      userInteracted = true;
      stopAutoplay();
      snapToIndex(currentIndex + 1);
    }
    if (e.key === "ArrowLeft") {
      userInteracted = true;
      stopAutoplay();
      snapToIndex(currentIndex - 1);
    }
  });

  // Autoplay (solo se non reduce motion)
  const startAutoplay = () => {
    if (reduceMotion) return;
    if (autoplayTimer) return;
    autoplayTimer = setInterval(() => {
      if (userInteracted) return; // se ha già interagito, non rompere
      const next = (currentIndex + 1) > maxIndex() ? 0 : currentIndex + 1;
      snapToIndex(next);
    }, 3500);
  };

  const stopAutoplay = () => {
    if (!autoplayTimer) return;
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  // Init
  buildDots();
  snapToIndex(0);
  startAutoplay();

  // Recalc on resize (per responsive)
  window.addEventListener("resize", () => {
    // ri-snappa senza glitch
    snapToIndex(currentIndex);
  });
})();

// NAVBAR MOBILE

(() => {
  const burger = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!burger || !mobileMenu) return;

  // Overlay (clic fuori chiude)
  let overlay = document.querySelector(".mobile-menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";
    document.body.appendChild(overlay);
  }

  // CSS overlay (solo se non l’hai già in CSS)
  if (!document.getElementById("mm-mobile-overlay-style")) {
    const style = document.createElement("style");
    style.id = "mm-mobile-overlay-style";
    style.textContent = `
      .mobile-menu-overlay{
        position:fixed; inset:0;
        background: rgba(0,0,0,.35);
        opacity:0;
        pointer-events:none;
        transition: opacity .35s ease;
      }
      .mobile-menu-overlay.active{
        opacity:1;
        pointer-events:auto;
      }
      body.menu-open{ overflow:hidden; }
    `;
    document.head.appendChild(style);
  }

  function openMenu(){
    burger.classList.add("open");
    mobileMenu.classList.add("active");
    overlay.classList.add("active");

    burger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  }

  function closeMenu(){
    burger.classList.remove("open");
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");

    burger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");

    // chiudi dropdown aperti (pulito)
    mobileMenu.querySelectorAll(".mobile-has-dropdown.open").forEach(li => {
      li.classList.remove("open");
      const sub = li.querySelector(".mobile-submenu");
      if (sub) sub.style.maxHeight = "0px";
      const t = li.querySelector(".mobile-dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }

  function toggleMenu(){
    mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
  }

  // Burger
  burger.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Overlay click
  overlay.addEventListener("click", closeMenu);

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) closeMenu();
  });

  // Click su link -> chiudi
  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  // Dropdown mobile
  mobileMenu.querySelectorAll(".mobile-has-dropdown").forEach(item => {
    const toggle = item.querySelector(".mobile-dropdown-toggle");
    const submenu = item.querySelector(".mobile-submenu");
    if (!toggle || !submenu) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = item.classList.contains("open");

      // chiudi gli altri
      mobileMenu.querySelectorAll(".mobile-has-dropdown.open").forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          const s = other.querySelector(".mobile-submenu");
          const t = other.querySelector(".mobile-dropdown-toggle");
          if (s) s.style.maxHeight = "0px";
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        submenu.style.maxHeight = "0px";
        toggle.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        submenu.style.maxHeight = submenu.scrollHeight + "px";
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  // resize: se desktop, chiudi
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 769 && mobileMenu.classList.contains("active")) closeMenu();
    // ricalcola altezza submenu aperti
    mobileMenu.querySelectorAll(".mobile-has-dropdown.open .mobile-submenu").forEach(sub => {
      sub.style.maxHeight = sub.scrollHeight + "px";
    });
  });

  // init aria
  burger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
})();

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
      'seniordeveloper',
      'srdeveloper',
      'sr developer',
      'senior developer',
    ].map(norm)),
    graphic: new Set([
      'graphic',
      'jrgraphic',
      'jr graphic',
      'junior graphic',
      'juniorgraphic',
      'seniorgraphic',
      'srgraphic',
      'sr graphic',
      'senior graphic',
    ].map(norm)),
    mod: new Set([
      'mod',
      'senior mod',
      'sr mod',
      'srmod',
      'seniormod',
    ].map(norm)),
    admin: new Set([
      'admin',
      'senior admin',
      'sr admin',
      'sradmin',
      'senioradmin',
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