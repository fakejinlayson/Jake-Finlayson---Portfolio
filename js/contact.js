/* ============================================================
   CONTACT — page logic.
   Depends on: gsap, ScrollTrigger (CDN), site-helpers.js.
   Defines window.initPage, called by preloader.js.
   ============================================================ */

window.initPage = function () {
  SiteHelpers.registerPlugins();
  SiteHelpers.animateChrome();

  // Hero entrance
  gsap.from('.contact-hero__eyebrow', {
    opacity: 0, y: 16, duration: 0.6, delay: 0.32, ease: 'power2.out'
  });
  gsap.from('.contact-hero__title', {
    opacity: 0, y: 44, duration: 0.9, delay: 0.42, ease: 'power2.out'
  });

  // Grid columns fade in on scroll
  gsap.from('.contact-col', {
    opacity: 0,
    y: 28,
    duration: 0.65,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ScrollTrigger.refresh(); });
  }
};
