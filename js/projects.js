/* ============================================================
   PROJECTS — work/projects page logic.
   Depends on: gsap, ScrollTrigger (CDN), site-helpers.js.
   Defines window.initPage, called by preloader.js.
   ============================================================ */

const PROJECTS = [
  {
    id: 'chutney',
    title: 'Chutney: Space Survivor',
    href: 'chutney.html',
    image: 'assets/images/projects/img-chutney.jpg',
    categories: ['game-dev', 'music']
  },
  {
    id: 'twodudes',
    title: 'two dudes',
    href: 'twodudes.html',
    image: 'assets/images/projects/img-twodudes.png',
    categories: ['marketing', 'video']
  },
  {
    id: 'hato-hone-st-john',
    title: 'Hato Hone St John',
    href: 'hato-hone-st-john.html',
    image: 'assets/images/projects/img-hato-hone-st-john.png',
    categories: ['marketing', 'video']
  },
  {
    id: 'scrabblenz',
    title: 'NZ Scrabble',
    href: 'scrabblenz.html',
    image: 'assets/images/projects/img-scrabble.jpg',
    categories: ['video']
  },
  {
    id: 'ridden',
    title: 'RIDDEN',
    href: 'ridden.html',
    image: 'assets/images/projects/img-ridden.jpg',
    categories: ['game-dev', 'music']
  },
  {
    id: 'game-grimoire',
    title: 'Game Grimoire YT',
    href: 'game-grimoire.html',
    image: 'assets/images/projects/img-gamegrimoire.jpg',
    categories: ['game-dev', 'video']
  },
  {
    id: 'tides-under-all',
    title: 'tides under all',
    href: 'tides-under-all.html',
    image: 'assets/images/projects/img-tidesunderall.jpg',
    categories: ['music']
  },
  {
    id: 'saniti',
    title: 'SANITI',
    href: 'saniti.html',
    image: 'assets/images/projects/img-saniti.jpg',
    categories: ['marketing', 'video']
  },
  {
    id: 'foodbank-nelson',
    title: 'Nelson Community Foodbank',
    href: 'foodbank-nelson.html',
    image: 'assets/images/projects/img-foodbank.jpg',
    categories: ['marketing']
  },
  {
    id: 'cd-rom',
    title: 'cdROM.480p.hd_freeDownload',
    href: 'cd-rom.html',
    image: 'assets/images/projects/img-cdrom.jpg',
    categories: ['game-dev']
  },
  {
    id: 'chur-bol',
    title: 'Chur Bol BBQ',
    href: 'chur-bol.html',
    image: 'assets/images/projects/img-churbol.jpg',
    categories: ['marketing']
  },
  {
    id: 'makerspace',
    title: 'Makerspace',
    href: 'makerspace.html',
    image: 'assets/images/projects/img-makerspace.jpg',
    categories: ['game-dev', 'marketing']
  }
];

const CAT_LABELS = {
  'game-dev': 'Game Dev',
  'marketing': 'Marketing',
  'video': 'Video',
  'music': 'Music'
};

let activeFilter = 'all';
const grid = document.getElementById('projects-grid');
const countEl = document.getElementById('projects-count');

function buildGrid(filter) {
  const visible = PROJECTS.filter(p =>
    filter === 'all' || p.categories.includes(filter)
  );

  countEl.textContent = visible.length + ' project' + (visible.length !== 1 ? 's' : '');
  grid.innerHTML = '';

  visible.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'proj-card';
    a.href = p.href;

    const tags = p.categories
      .map(c => `<span class="proj-card__tag">${CAT_LABELS[c] || c}</span>`)
      .join('');

    a.innerHTML = `
      <img class="proj-card__img" src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="proj-card__overlay">
        <div class="proj-card__title">${p.title}</div>
        <div class="proj-card__tags">${tags}</div>
      </div>
    `;

    grid.appendChild(a);

    gsap.from(a, {
      opacity: 0,
      y: 18,
      duration: 0.4,
      delay: i * 0.04,
      ease: 'power2.out'
    });
  });
}

window.initPage = function () {
  SiteHelpers.registerPlugins();
  SiteHelpers.animateChrome();

  // Sidebar entrance
  gsap.from('.projects-sidebar__eyebrow, .projects-sidebar__title', {
    opacity: 0, y: 20, duration: 0.7, stagger: 0.1, delay: 0.3, ease: 'power2.out'
  });
  gsap.set('.cat-nav', { opacity: 0, y: 12 });
  gsap.to('.cat-nav', { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });

  // Initial grid
  buildGrid('all');

  // Filter clicks
  document.querySelectorAll('.cat-nav__item').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (filter === activeFilter) return;
      activeFilter = filter;

      document.querySelectorAll('.cat-nav__item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      gsap.to('#projects-grid', {
        opacity: 0,
        duration: 0.18,
        onComplete: () => {
          buildGrid(filter);
          gsap.to('#projects-grid', { opacity: 1, duration: 0.25 });
        }
      });
    });
  });

  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ScrollTrigger.refresh(); });
  }
};
