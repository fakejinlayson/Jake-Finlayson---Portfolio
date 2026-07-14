/* ============================================================
   SHARED ANIMATION HELPERS
   Common GSAP/ScrollTrigger patterns reused across pages, so
   each page's own script can stay focused on its specific
   content rather than re-deriving these every time.

   Load order on every page:
     1. gsap.min.js, ScrollTrigger.min.js (and Draggable.min.js
        if that page uses draggable windows)
     2. this file (site-helpers.js)
     3. the page's own script, which defines window.initPage
     4. preloader.js — loads last because it calls window.initPage()
        as soon as loading finishes; that function must already exist
   ============================================================ */

const SiteHelpers = (function () {
  let pluginsRegistered = false;

  /**
   * Registers GSAP plugins once. Safe to call from every page's
   * initPage even though only some pages use Draggable — passing
   * an already-registered plugin again is a harmless no-op.
   */
  function registerPlugins() {
    if (pluginsRegistered) return;
    gsap.registerPlugin(ScrollTrigger);
    if (typeof Draggable !== 'undefined') {
      gsap.registerPlugin(Draggable);
    }
    pluginsRegistered = true;
  }

  /**
   * Standard nav + scroll-hint entrance, identical across every
   * page so the site feels consistent the instant it loads.
   */
  function animateChrome() {
    gsap.from('body > nav', { y: -40, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });

    const hint = document.querySelector('.scroll-hint');
    if (hint) {
      ScrollTrigger.create({
        start: 'top top',
        end: 99999,
        onUpdate: (self) => {
          gsap.to(hint, { opacity: self.scroll() > 50 ? 0 : 1, duration: 0.3 });
        }
      });
    }
  }

  /**
   * Pins a section for a given scroll distance and returns the
   * ScrollTrigger instance, so callers can attach further scrubbed
   * tweens to the same trigger/start/end without repeating them.
   * This is the "hold a section in place" pattern used throughout
   * the homepage (showreel, about, explore-intro, explore-exit).
   *
   * @param {string} selector - trigger element selector
   * @param {string} distance - e.g. '+=70%', matches GSAP's end syntax
   * @returns {object} { trigger, start, end } for reuse in paired tweens
   */
  function pinSection(selector, distance) {
    const config = { trigger: selector, start: 'top top', end: distance };
    ScrollTrigger.create({ ...config, pin: true });
    return config;
  }

  /**
   * The "About"-style line-by-line text reveal: each line's text
   * sits in an overflow-hidden wrapper, slides up from below and
   * fades in, staggered, scrubbed to scroll position. Returns the
   * timeline so callers can chain further tweens (e.g. a fade-out)
   * onto it at an explicit position.
   *
   * @param {string} containerSelector - wraps all the line elements
   * @param {string} lineSelector - the inner text span within each line
   * @param {object} scrollConfig - { trigger, start, end } to scrub against
   * @param {number} totalDuration - explicit timeline length so position
   *   values (0–1 etc) are predictable rather than auto-sized
   */
  function lineReveal(containerSelector, lineSelector, scrollConfig, totalDuration) {
    const lines = document.querySelectorAll(`${containerSelector} ${lineSelector}`);
    gsap.set(lines, { yPercent: 110, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { duration: totalDuration ? 1 : undefined },
      scrollTrigger: { ...scrollConfig, scrub: true }
    });

    tl.to(lines, { yPercent: 0, opacity: 1, ease: 'none', stagger: 0.08 }, 0);

    if (totalDuration) {
      tl.set({}, {}, totalDuration);
    }

    return tl;
  }

  return { registerPlugins, animateChrome, pinSection, lineReveal };
})();
