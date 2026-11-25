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
// BIG NUMBERS — fit to their boxes
// Every number in a row shares one font size: the largest size at
// which the widest final value fits inside its box with 10% to spare. Re-run
// on resize. (Measured from the final text, so the count-up
// animation never changes the size.)
// ============================================================
function fitStats() {
  document.querySelectorAll('.proj-stats').forEach(row => {
    row.style.removeProperty('--stat-size');
    const nums = [...row.querySelectorAll('.proj-stat__num')];
    if (!nums.length) return;
    const base = parseFloat(getComputedStyle(nums[0]).fontSize);
    let scale = 1;
    nums.forEach(num => {
      const box = num.parentElement;
      const cs = getComputedStyle(box);
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const probe = num.cloneNode(false);
      probe.textContent = num.dataset.final || num.textContent;
      probe.style.cssText = 'position:absolute;visibility:hidden;display:inline-block;white-space:nowrap;';
      box.appendChild(probe);
      scale = Math.min(scale, (avail * 0.9) / probe.getBoundingClientRect().width); // 10% breathing room
      probe.remove();
    });
    if (scale < 1) row.style.setProperty('--stat-size', Math.floor(base * scale) + 'px');
  });
}

// ============================================================
// BIG NUMBERS — count up from 0 when scrolled into view
// Only numbers with a data-count attribute animate; the text
// already in the HTML is the final value, so without JS (or
// before the scroll) it still reads correctly.
// ============================================================
function initCountUps() {
  document.querySelectorAll('.proj-stat__num').forEach(el => { el.dataset.final = el.textContent; });
  fitStats();
  let fitTimer;
  window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitStats, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStats);

  document.querySelectorAll('.proj-stat__num[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const counter = { value: 0 };

    const render = () => {
      el.textContent = prefix + counter.value.toLocaleString('en-NZ', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(counter, { value: target, duration: 1.6, ease: 'power2.out', onUpdate: render });
      }
    });
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
  const triggers = document.querySelectorAll('.proj-gallery img, .proj-hero-img img, .proj-img, .proj-phones img');
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
    '.proj-videos .proj-video-item',
    '.proj-phones img',
    '.proj-stat'
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
  initCountUps();
  // initPageIcons(); // floating hero icons disabled

  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ScrollTrigger.refresh(); });
  }
};
