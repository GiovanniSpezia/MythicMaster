// Store JS - MythicMaster theme (purple + gold)

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const navBurger = $("#navBurger");
const navLinks = $("#navLinks");
const toTop = $("#toTop");

const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxClose = $("#lightboxClose");

const buyModal = $("#buyModal");
const buyClose = $("#buyClose");
const buyImg = $("#buyImg");
const buyTitle = $("#buyTitle");
const buyDesc = $("#buyDesc");
const buyForm = $("#buyForm");

const toast = $("#toast");
const year = $("#year");

function setAria(el, name, value){ el?.setAttribute(name, String(value)); }

function showToast(text){
  if(!toast) return;
  toast.textContent = text;
  toast.classList.add("is-show");
  setAria(toast, "aria-hidden", "false");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.classList.remove("is-show");
    setAria(toast, "aria-hidden", "true");
  }, 2200);
}

function openLightbox(src){
  lightboxImg.src = src;
  lightbox.classList.add("is-open");
  setAria(lightbox, "aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox(){
  lightbox.classList.remove("is-open");
  setAria(lightbox, "aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

function openBuyModal({title, desc, image}){
  buyTitle.textContent = title || "Prodotto";
  buyDesc.textContent = desc || "";
  buyImg.src = image || "";
  buyImg.alt = title || "Prodotto";
  buyModal.classList.add("is-open");
  setAria(buyModal, "aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeBuyModal(){
  buyModal.classList.remove("is-open");
  setAria(buyModal, "aria-hidden", "true");
  document.body.style.overflow = "";
}

function onScroll(){
  if(!toTop) return;
  if(window.scrollY > 420) toTop.classList.add("is-show");
  else toTop.classList.remove("is-show");
}

// Mobile nav toggle
navBurger?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  setAria(navBurger, "aria-expanded", isOpen);
});

// Close nav when clicking a link (mobile)
$$(".nav__links a").forEach(a => {
  a.addEventListener("click", () => {
    if(navLinks.classList.contains("is-open")){
      navLinks.classList.remove("is-open");
      setAria(navBurger, "aria-expanded", false);
    }
  });
});

// To top
toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Lightbox bind
$$("[data-lightbox]").forEach(el => {
  el.addEventListener("click", () => openLightbox(el.getAttribute("data-lightbox")));
});
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if(e.target === lightbox) closeLightbox();
});

// Buy modal bind
$$(".js-buy").forEach(btn => {
  btn.addEventListener("click", () => {
    openBuyModal({
      title: btn.dataset.title,
      desc: btn.dataset.desc,
      image: btn.dataset.image
    });
  });
});
buyClose?.addEventListener("click", closeBuyModal);
buyModal?.addEventListener("click", (e) => {
  if(e.target === buyModal) closeBuyModal();
});

// Form submit (demo)
buyForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(buyForm);

  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const qty = (data.get("qty") || "1").toString().trim();

  // Qui puoi collegare un backend: fetch("/api/order", { method:"POST", body: JSON.stringify(...) })
  closeBuyModal();
  buyForm.reset();
  showToast(`Ordine inviato ✅ (${qty}x) — grazie, ${name || "avventuriero"}!`);
});

// Escape to close overlays
window.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
    if(lightbox?.classList.contains("is-open")) closeLightbox();
    if(buyModal?.classList.contains("is-open")) closeBuyModal();
  }
});

// Year footer + scroll
if(year) year.textContent = new Date().getFullYear();
window.addEventListener("scroll", onScroll);
onScroll();