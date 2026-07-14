/* ============================================================
   ABOUT — page logic.
   Depends on: gsap, ScrollTrigger (CDN), site-helpers.js.
   Defines window.initPage, called by preloader.js.
   ============================================================ */

window.initPage = function () {
  SiteHelpers.registerPlugins();
  SiteHelpers.animateChrome();

  // ---------- HERO — fires on load, no pin on content-heavy page ----------
  gsap.from('.about-hero__eyebrow', {
    opacity: 0, y: 16, duration: 0.6, delay: 0.35, ease: 'power2.out'
  });
  gsap.from('.about-hero__title', {
    opacity: 0, y: 44, duration: 0.85, delay: 0.42, ease: 'power2.out'
  });
  gsap.from('.about-hero__sub', {
    opacity: 0, y: 22, duration: 0.7, delay: 0.58, ease: 'power2.out'
  });

  // ---------- BIO — fade in on scroll ----------
  gsap.from('.bio-grid', {
    opacity: 0,
    y: 32,
    duration: 0.75,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.bio-section',
      start: 'top 78%',
      toggleActions: 'play none none none'
    }
  });

  // ---------- SECTION HEADINGS ----------
  document.querySelectorAll('.timeline-section__heading').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 16, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // ---------- TIMELINE ITEMS — dot pops, entry slides in ----------
  // Set initial hidden state
  gsap.set('.timeline-item', { opacity: 0, x: 28 });
  gsap.set('.timeline-dot', { scale: 0 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    const dot = item.querySelector('.timeline-dot');

    ScrollTrigger.create({
      trigger: item,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(dot, { scale: 1, duration: 0.28, ease: 'back.out(1.7)' });
        gsap.to(item, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.07 });
      }
    });
  });

  // Refresh after layout stabilises
  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ScrollTrigger.refresh(); });
  }
};
