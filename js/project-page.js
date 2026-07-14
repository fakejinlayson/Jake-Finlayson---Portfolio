/* ============================================================
   PROJECT-PAGE — shared script for all individual project pages.
   Depends on: gsap, ScrollTrigger (CDN), site-helpers.js.
   Defines window.initPage, called by preloader.js.
   ============================================================ */

// ============================================================
// CAROUSEL
// ============================================================
function initCarousels() {
  document.querySelectorAll('.proj-carousel').forEach(carousel => {
    const images = JSON.parse(carousel.dataset.images || '[]');
    if (images.length < 2) return;

    const img = carousel.querySelector('.proj-carousel__img');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    let current = 0;

    function goTo(index) {
      current = (index + images.length) % images.length;
      gsap.to(img, {
        opacity: 0,
        duration: 0.16,
        onComplete: () => {
          img.src = images[current];
          gsap.to(img, { opacity: 1, duration: 0.22 });
        }
      });
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
  });
}

// ============================================================
// DRAGGABLE HERO ICONS — disabled, keeping in case they come back
// ============================================================
/*
function initPageIcons() {
  const icons = document.querySelectorAll('.proj-icon');
  if (!icons.length || typeof Draggable === 'undefined') return;

  icons.forEach(icon => {
    const hero = icon.closest('.proj-hero');
    Draggable.create(icon, {
      type: 'x,y',
      bounds: hero || document.body,
      inertia: false,
      onDragEnd: function () {
        gsap.to(icon, { x: 0, y: 0, duration: 0.65, ease: 'power3.out' });
      }
    });

    gsap.from(icon, { opacity: 0, scale: 0.6, duration: 0.5, delay: 0.7, ease: 'back.out(1.7)' });
  });
}
*/

// ============================================================
// LIGHTBOX
// ============================================================
function initLightbox() {
  const triggers = document.querySelectorAll('.proj-gallery img, .proj-hero-img img, .proj-img');
  if (!triggers.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <img class="lightbox__img" alt="">
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector('.lightbox__img');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  triggers.forEach(el => {
    el.addEventListener('click', () => open(el.currentSrc || el.src, el.alt));
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

// ============================================================
// PAGE INIT
// ============================================================
window.initPage = function () {
  SiteHelpers.registerPlugins();
  SiteHelpers.animateChrome();

  // Hero entrance
  gsap.from('.proj-hero__back',  { opacity: 0, x: -14, duration: 0.5, delay: 0.25, ease: 'power2.out' });
  gsap.from('.proj-hero__tags',  { opacity: 0, y: 10,  duration: 0.5, delay: 0.32, ease: 'power2.out' });
  gsap.from('.proj-hero__title', { opacity: 0, y: 44,  duration: 0.8, delay: 0.38, ease: 'power2.out' });
  gsap.from('.proj-hero__desc',  { opacity: 0, y: 20,  duration: 0.6, delay: 0.54, ease: 'power2.out' });

  // Sections: reveal as they enter viewport
  document.querySelectorAll('.proj-section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 28,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Individual media elements reveal
  const mediaSelectors = [
    '.proj-gallery img',
    '.proj-img',
    '.proj-embed-wrap',
    '.proj-spotify',
    '.proj-itch',
    '.proj-steam',
    '.proj-videos .proj-video-item'
  ].join(', ');

  document.querySelectorAll(mediaSelectors).forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 18,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  initCarousels();
  initLightbox();
  // initPageIcons(); // floating hero icons disabled

  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ScrollTrigger.refresh(); });
  }
};
