/* ============================================================
   HOME — homepage-specific logic.
   Depends on: gsap, ScrollTrigger, Draggable (CDN), site-helpers.js.
   Defines window.initPage, which preloader.js calls once loading
   finishes.
   ============================================================ */

// ============================================================
// CATEGORY DATA
// Each category has a set of example windows, pulled from the
// same project galleries used on projects.html. Widths/heights
// vary intentionally — landscape stills, portrait stills, and
// square thumbnails coexist, mirroring real asset variety.
// ============================================================
const CATEGORIES = {
  'Game Dev': [
    { w: 320, h: 220, label: 'Chutney', src: 'assets/images/projects/chutney/chutney-gameplay1.webp' },
    { w: 240, h: 300, label: 'RIDDEN', src: 'assets/images/projects/ridden/ridden-4.webp' },
    { w: 360, h: 200, label: 'Game Grimoire', src: 'assets/images/projects/game grimoire/game-grimoire-screenshot1.webp' },
    { w: 260, h: 260, label: 'Makerspace', src: 'assets/images/projects/makerspace/makerspace-game.webp' }
  ],
  'Video': [
    { w: 360, h: 200, label: 'two dudes', src: 'assets/images/projects/twodudes/twodudes-img-3.webp' },
    { w: 220, h: 300, label: 'Hato Hone St John', src: 'assets/images/projects/hhstj/hhstj-img-9.webp' },
    { w: 300, h: 220, label: 'NZ Scrabble', src: 'assets/images/projects/scrabble/scrabble-obs.webp' },
    { w: 240, h: 240, label: 'SANITI', src: 'assets/images/projects/saniti/saniti-event-1.webp' }
  ],
  'Marketing & Design': [
    { w: 340, h: 200, label: 'Nelson Community Foodbank', src: 'assets/images/projects/foodbank nelson/logo-redesign.webp' },
    { w: 280, h: 280, label: 'Chur Bol BBQ', src: 'assets/images/projects/chur bol/chur-burger.webp' },
    { w: 300, h: 220, label: 'Hato Hone St John', src: 'assets/images/projects/hhstj/hhstj-img-5.webp' },
    { w: 300, h: 220, label: 'Two Dudes', src: 'assets/images/projects/twodudes/twodudes-img-2.webp' }
  ],
  'Music': [
    { w: 260, h: 260, label: 'Chutney OST', src: 'assets/images/projects/chutney/chutney-ost.webp' },
    { w: 320, h: 190, label: 'tides under all', src: 'assets/images/projects/tides under all/tides-under-all-cover.webp' },
    { w: 320, h: 280, label: '3mourn', src: 'assets/images/projects/3mourn-img-ss.webp' }
  ]
};

// ============================================================
// WINDOW MANAGER
// ============================================================
const canvas = document.getElementById('window-canvas');
const emptyState = document.getElementById('emptyState');
let zCounter = 10;
let activeWindows = [];

function bringToFront(winEl) {
  zCounter += 1;
  winEl.style.zIndex = zCounter;
}

function closeWindow(winEl) {
  gsap.to(winEl, {
    opacity: 0,
    scale: 0.92,
    duration: 0.2,
    ease: 'power1.in',
    onComplete: () => winEl.remove()
  });
  activeWindows = activeWindows.filter(w => w !== winEl);
}

function clearAllWindows() {
  activeWindows.forEach(w => w.remove());
  activeWindows = [];
}

function randomPosition(boxW, boxH, canvasW, canvasH, index, total) {
  // scatter windows across the canvas using loose grid zones + jitter,
  // so they don't all pile in the center
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  const zoneW = canvasW / cols;
  const zoneH = canvasH / rows;
  const col = index % cols;
  const row = Math.floor(index / cols);

  const jitterX = (Math.random() - 0.5) * zoneW * 0.3;
  const jitterY = (Math.random() - 0.5) * zoneH * 0.3;

  let x = zoneW * col + (zoneW - boxW) / 2 + jitterX;
  let y = zoneH * row + (zoneH - boxH) / 2 + jitterY;

  x = Math.max(12, Math.min(x, canvasW - boxW - 12));
  y = Math.max(12, Math.min(y, canvasH - boxH - 12));

  return { x, y };
}

function windowScale() {
  const vw = window.innerWidth;
  if (vw <= 480) return 0.52;
  if (vw <= 768) return 0.65;
  return 1;
}

function openCategory(categoryName) {
  clearAllWindows();
  emptyState.style.display = 'none';

  const items = CATEGORIES[categoryName] || [];
  const canvasRect = canvas.getBoundingClientRect();
  const canvasW = canvasRect.width;
  const canvasH = canvasRect.height;
  const scale = windowScale();

  items.forEach((item, i) => {
    const w = Math.round(item.w * scale);
    const h = Math.round(item.h * scale);

    const winEl = document.createElement('div');
    winEl.className = 'win';
    winEl.style.width = w + 'px';
    winEl.style.height = h + 'px';

    const pos = randomPosition(w, h, canvasW, canvasH, i, items.length);
    winEl.style.left = pos.x + 'px';
    winEl.style.top = pos.y + 'px';

    winEl.innerHTML = `
      <div class="win-titlebar">
        <span class="win-title">${item.label}</span>
        <button class="win-close" aria-label="Close"></button>
      </div>
      <div class="win-body">
        <img src="${item.src}" alt="${item.label}" loading="lazy">
      </div>
    `;

    canvas.appendChild(winEl);
    activeWindows.push(winEl);

    // entrance: scattered pop-in with slight rotation for a tossed-down feel
    gsap.set(winEl, { opacity: 0, scale: 0.85, rotation: (Math.random() - 0.5) * 6 });
    gsap.to(winEl, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.45,
      delay: i * 0.06,
      ease: 'back.out(1.4)'
    });

    bringToFront(winEl);

    winEl.querySelector('.win-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(winEl);
    });

    winEl.addEventListener('mousedown', () => bringToFront(winEl));

    // type:'x,y' drags via CSS transforms, so x/y start at 0 regardless
    // of the element's left/top position. bounds.minX/maxX constrain the
    // transform value, not the visual position — so we must subtract the
    // element's initial left/top to get the correct visual boundary.
    // Without this, windows placed on the right start near their maxX and
    // can barely move, while windows on the left can drag way off-canvas.
    const dragInset = 4;
    Draggable.create(winEl, {
      type: 'x,y',
      bounds: {
        minX: dragInset - pos.x,
        minY: dragInset - pos.y,
        maxX: canvasW - w - dragInset - pos.x,
        maxY: canvasH - h - dragInset - pos.y
      },
      trigger: winEl.querySelector('.win-titlebar'),
      onPress: () => bringToFront(winEl)
    });
  });
}

// ============================================================
// PAGE INIT — called by preloader.js once loading finishes
// ============================================================
window.initPage = function () {
  SiteHelpers.registerPlugins();
  SiteHelpers.animateChrome();

  gsap.from('.reel-content', { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: 'power2.out' });

  // ---------- SHOWREEL: pin + scrubbed exit ----------
  // pinSpacing defaults to true (omitted) so the about section
  // can't slide up underneath while the showreel is still pinned.
  const showreelConfig = SiteHelpers.pinSection('#showreel', '+=70%');
  gsap.timeline({
    scrollTrigger: { ...showreelConfig, scrub: true }
  })
  .to('.reel-bg', { scale: 1.15, ease: 'none' }, 0)
  .to('.reel-content', { opacity: 0, scale: 0.9, y: -30, ease: 'none' }, 0.3);

  // ---------- SHOWREEL: vertigo blur ----------
  // Scrub-driven blur on the reel content as the user scrolls through the pin hold.
  const reelContent = document.querySelector('.reel-content');

  ScrollTrigger.create({
    ...showreelConfig,
    scrub: true,
    onUpdate: (self) => {
      const blur = Math.pow(self.progress, 0.3) * 1.5;  // 0 → 1.5px, hits ~50% at 10% scroll
      if (reelContent) reelContent.style.filter = `blur(${blur.toFixed(2)}px)`;
    }
  });

  // ---------- ABOUT: pin + line-by-line reveal (desktop) ----------
  // On mobile: skip pinning and scrubbed text reveal — the overflow-hidden
  // line wrappers keep text invisible until the scrub fires, which never
  // works reliably on mobile. Use a simple scroll-triggered entrance instead.
  if (window.innerWidth > 768) {
    const aboutConfig = SiteHelpers.pinSection('#about', '+=90%');
    const aboutTl = SiteHelpers.lineReveal('#about-lines', '.about-line span', aboutConfig, 4);
    aboutTl.to('#about .about-inner', { opacity: 0, ease: 'none' }, 2.8);
  } else {
    gsap.from('#about .about-photo-wrap', {
      opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '#about', start: 'top 82%', toggleActions: 'play none none none' }
    });
    gsap.from('#about-lines', {
      opacity: 0, y: 24, duration: 0.75, delay: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#about', start: 'top 82%', toggleActions: 'play none none none' }
    });
  }

  // ---------- ABOUT: draggable skill icons (all screen sizes) ----------
  document.querySelectorAll('.skill-icon').forEach((icon) => {
    const wrap = document.querySelector('.about-photo-wrap');
    const wrapW = wrap ? wrap.offsetWidth : 360;
    const wrapH = wrap ? wrap.offsetHeight : 440;
    Draggable.create(icon, {
      type: 'x,y',
      bounds: {
        minX: -Math.round(wrapW * 0.2),
        maxX: Math.round(wrapW * 1.05),
        minY: -Math.round(wrapH * 0.15),
        maxY: Math.round(wrapH * 1.1)
      },
      inertia: false,
      onDragEnd: function () {
        gsap.to(icon, { x: 0, y: 0, duration: 0.65, ease: 'power3.out' });
      }
    });
  });

  // ---------- EXPLORE: build category menu ----------
  const menu = document.getElementById('category-menu');
  Object.keys(CATEGORIES).forEach((name) => {
    const btn = document.createElement('button');
    btn.className = 'btn-outline';
    btn.textContent = name;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#category-menu .btn-outline').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      openCategory(name);
    });
    menu.appendChild(btn);
  });

  // ---------- EXPLORE: pin through full reveal ----------
  // the canvas is part of the pinned block so it settles into its
  // resting position before the pin releases — no early clicks on a
  // mid-transition canvas. never pinned during actual dragging/clicking.
  gsap.set('#explore-intro .explore-heading, #explore-intro #category-menu', {
    opacity: 0,
    y: 24
  });
  gsap.set('#window-canvas', { opacity: 0, y: 30, scale: 0.98 });

  SiteHelpers.pinSection('#explore-intro', '+=70%');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#explore-intro',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })
  .to('#explore-intro .explore-heading, #explore-intro #category-menu', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  })
  .to('#window-canvas', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.35);

  // ---------- EXPLORE: exit pin + fade before contact ----------
  // pins #explore-exit (a dedicated fixed-height element) rather than
  // #explore itself — pinning a parent whose height depends on a nested
  // pinned child is a known empty-gap / miscalculated-height bug source.
  const exploreExitConfig = SiteHelpers.pinSection('#explore-exit', '+=60%');
  gsap.to('#explore-intro-fade', {
    opacity: 0,
    y: -30,
    ease: 'none',
    scrollTrigger: { ...exploreExitConfig, scrub: true }
  });

  // ---------- CONTACT: held entrance ----------
  gsap.set('#contact', { opacity: 0, y: 30 });
  gsap.to('#contact', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // GSAP measures pinned elements' dimensions once at ScrollTrigger
  // creation time. Async font / asset loads that shift layout after
  // that point lock in stale measurements. Refresh after everything
  // has truly settled to recalculate every trigger.
  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
};

// ============================================================
// SHOWREEL: mute/unmute toggle
// Bound outside initPage — the button should work as soon as the
// video is on screen, not just once the preloader finishes.
// ============================================================
(function () {
  const video = document.getElementById('reelVideo');
  const toggle = document.getElementById('muteToggle');
  if (!video || !toggle) return;

  toggle.addEventListener('click', () => {
    video.muted = !video.muted;
    toggle.classList.toggle('is-muted', video.muted);
    toggle.setAttribute('aria-pressed', String(!video.muted));
    toggle.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  });
})();
