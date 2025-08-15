// Modelli Menu
(function () {
    const cards = document.querySelectorAll('.art-card');
    const lb = document.getElementById('art-lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbName = document.getElementById('lb-name');
    const lbProduct = document.getElementById('lb-product');
    const closeBtn = lb.querySelector('.lb-close');
    const prevBtn = lb.querySelector('.lb-prev');
    const nextBtn = lb.querySelector('.lb-next');
    let currentIndex = -1;
    const items = Array.from(cards);

    function openLightbox(i) {
        const card = items[i];
        lbImg.src = card.dataset.src || card.querySelector('img').src;
        lbImg.alt = card.querySelector('img').alt || '';
        lbName.textContent = card.dataset.name || '';
        lbProduct.textContent = card.dataset.product || '';
        lb.setAttribute('aria-hidden', 'false');
        currentIndex = i;
        document.body.style.overflow = 'hidden';
        setTimeout(() => lb.querySelector('.lb-close').focus(), 100);
    }

    function closeLightbox() {
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function prev() {
        if (currentIndex > 0) openLightbox(currentIndex - 1);
    }

    function next() {
        if (currentIndex < items.length - 1) openLightbox(currentIndex + 1);
    }

    items.forEach((card, i) => {
        card.addEventListener('click', () => openLightbox(i));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(i);
            }
        });
        card.addEventListener('mousemove', (ev) => {
            const rect = card.getBoundingClientRect();
            const x = (ev.clientX - rect.left) / rect.width - 0.5;
            const y = (ev.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 6}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
        if (lb.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        }
    });

    lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
    });
})();

// Store Popup
// ===========================
// Popup Acquisto
// ===========================
const purchasePopup = document.getElementById('purchase-popup');
const purchaseBtns = document.querySelectorAll('.service-btn, .cta-small'); // tutti i bottoni acquista
const closePopupBtn = document.querySelector('.popup-close');
const purchaseForm = document.getElementById('purchase-form');

// Apri popup quando si clicca su "Acquista"
purchaseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Se il bottone ha prodotto specifico, precompila il select
        const productName = btn.closest('.service-card')?.querySelector('.service-heading')?.textContent || 
                            btn.closest('figure')?.dataset.product || '';
        if(productName) purchaseForm.prodotto.value = productName;

        purchasePopup.classList.add('active');
    });
});

// Chiudi popup
closePopupBtn.addEventListener('click', () => {
    purchasePopup.classList.remove('active');
});

// Chiudi cliccando fuori dal popup
purchasePopup.addEventListener('click', (e) => {
    if(e.target === purchasePopup) {
        purchasePopup.classList.remove('active');
    }
});

// ===========================
// Invio form via mailto
// ===========================
purchaseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = this.nome.value.trim();
    const cognome = this.cognome.value.trim();
    const email = this.email.value.trim();
    const prodotto = this.prodotto.value;
    const messaggio = this.messaggio.value.trim();

    // Prepara il corpo della mail
    const mailBody = `
Nome: ${nome}
Cognome: ${cognome}
Email: ${email}
Prodotto: ${prodotto}
Messaggio: ${messaggio}
    `;

    const encodedBody = encodeURIComponent(mailBody);
    const mailtoLink = `mailto:info@mythicmaster.it?subject=Richiesta%20Acquisto%20${encodeURIComponent(prodotto)}&body=${encodedBody}`;

    // Apri il client mail
    window.location.href = mailtoLink;

    // Chiudi popup e reset form
    purchasePopup.classList.remove('active');
    this.reset();
});

// ===========================
// Animazioni card quando entrano in viewport
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    cards.forEach(card => observer.observe(card));
});

// ===========================
// Parallax immagine info-store
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const infoStoreSection = document.getElementById('info-store');
    if(!infoStoreSection) return;
    const imageWrapper = infoStoreSection.querySelector('.image-wrapper');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                imageWrapper.classList.add('parallax-active');
            } else {
                imageWrapper.classList.remove('parallax-active');
            }
        });
    }, observerOptions);
    observer.observe(infoStoreSection);
});