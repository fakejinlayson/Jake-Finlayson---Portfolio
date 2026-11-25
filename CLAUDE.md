# Jake Finlayson portfolio — jakefinlayson.co.nz

Jake's work portfolio. Plain HTML/CSS/vanilla JS + GSAP. **No framework, no
build step, no package.json.** Jake is "mostly HTML/CSS, light JS", so keep
code readable and well commented, and prefer vanilla JS + GSAP over adding
libraries or tooling.

## Hosting and deploy

- **Netlify**, auto-deploying from GitHub `fakejinlayson/Jake-Finlayson---Portfolio`,
  branch `main`. Pushing to `main` = deploying to the live site.
- Netlify "pretty URLs" post-processing rewrites links on the live site
  (`about.html` → `/about`, `index.html` → `/`). In the repo, always link
  with plain relative `.html` filenames.
- **Git LFS** holds `*.mp4`, `*.mov`, `*.pdf` and all images under
  `assets/images/projects/**` (see `.gitattributes`). New media in those
  paths must go through LFS; Netlify serves the real files.
- No favicon, `robots.txt`, `sitemap.xml` or Open Graph tags exist yet.

## Local preview

Serve the folder rather than opening files directly (relative paths and the
GSAP CDN need a real origin): `python -m http.server 8099` in the repo, or the
"portfolio" entry in `C:\Users\finla\.claude\launch.json` for the Claude
browser pane. When the pane is hidden, rAF stops, so the preloader never
finishes; hide `#preloader` and call `initPage()` by hand to test.

## File layout (flat — keep it flat)

```
*.html                 all pages at the root, no per-page subfolders
css/base.css           shared: reset, colour tokens, nav, preloader, scroll-hint,
                       .btn / .btn-outline, footer.site-footer
css/<page>.css         page-specific (home, about, projects, contact, project-page)
js/site-helpers.js     SiteHelpers: registerPlugins, animateChrome, pinSection, lineReveal
js/<page>.js           page logic; defines window.initPage
js/preloader.js        shared preloader; calls window.initPage() when done
assets/images/         portrait.webp, icons/ (skill icons), projects/<project>/
assets/videos/         Showreel2026.mp4 + poster
```

## Page contract (every page follows this)

1. Markup: `#preloader` (with `#pct`, `#barFill`), the shared `<nav>` (mark the
   current section's link with `class="current"`), page content, then
   `footer.site-footer`.
2. CSS: `base.css` first, then the page stylesheet.
3. Scripts, in this order: gsap.min.js → ScrollTrigger.min.js
   (→ Draggable.min.js if needed), all GSAP 3.12.5 from cdnjs →
   `site-helpers.js` → the page script → `preloader.js` **last**.
4. The page script defines `window.initPage`. `preloader.js` tracks
   `document.images` + `<video>` `canplaythrough` (8s safety timeout, simulated
   load if there's nothing to track), fades out, then calls `initPage()`.
   All GSAP setup lives inside `initPage`.
5. End `initPage` with `ScrollTrigger.refresh()` on rAF, `window.load` and
   `document.fonts.ready`.

Nav and footer markup is duplicated in all 16 pages — a change to either
means editing every `.html` file.

## Pages

- **index.html** (`home.css`/`home.js`): pinned showreel hero (scrubbed scale,
  fade, blur; mute toggle bound outside initPage) → pinned About with
  `lineReveal` of `.about-line > span` and draggable skill icons that snap back
  (pin + scrub only above 768px) → Explore: category buttons spawn draggable
  window-chrome cards on `#window-canvas` from the `CATEGORIES` object →
  `#explore-exit` pinned fade → full-screen contact footer.
- **about.html**: hero, bio + portrait, Experience and Education timelines
  (content is hard-coded HTML). Scroll-triggered reveals, no pinning.
- **projects.html**: sticky sidebar filters + card grid rendered from the
  `PROJECTS` array in `js/projects.js` (categories: `game-dev`, `marketing`,
  `video`, `music`).
- **contact.html**: phone, email, GitHub/LinkedIn (Upwork commented out), CTA.
- **Project pages** (`daily-games`, `chutney`, `twodudes`, `hato-hone-st-john`,
  `scrabblenz`, `ridden`, `game-grimoire`, `tides-under-all`, `saniti`,
  `foodbank-nelson`, `cd-rom`, `chur-bol`, `makerspace`, `opportunity-party`)
  share `project-page.css`/`.js`. The Opportunity Party stats are preliminary
  2026 election results; update them once final results are out (27 Nov 2026).

### Project page building blocks

`proj-hero` (back link, `proj-hero__tag`s, title, desc) · `proj-hero-img` ·
`proj-section` > `proj-section__inner` > `proj-section__heading` + body ·
`proj-cols` (`--2-3`, `--3-2`) · `proj-img` · `proj-gallery` · `proj-videos` >
`proj-video-item` (9:16, `--wide` spans 2 cols; use `preload="none"` + poster) ·
`proj-carousel` (image list in `data-images` JSON, `[data-carousel-prev/next]`) ·
embeds: `proj-embed-wrap > proj-embed` (YouTube), `proj-steam`, `proj-itch`,
`proj-spotify` · `proj-cta` · `proj-videos--4` (four reels per row) · `proj-phones` (tall mobile screenshots side by
side) · `proj-stats` > `proj-stat` > `proj-stat__num` + `proj-stat__label`
("big numbers"; `data-count`, optional `data-decimals`/`data-prefix`/`data-suffix`,
counts up on scroll; the HTML text is the final value) + optional `proj-stats-note` ·
`proj-section proj-fact` > `proj-fact__text` (one big statement above About; optional
`proj-fact__mark` eyebrow, `<span>` for the muted half).
Gallery/hero/`proj-img`/`proj-phones` images open in a lightbox.

### Adding a project

1. Copy the closest existing project page and edit it.
2. Put media in `assets/images/projects/<project>/` (webp for images; LFS-tracked).
3. Add an entry (with a card image) to `PROJECTS` in `js/projects.js`.
4. Optionally add windows to `CATEGORIES` in `js/home.js`.

## Design language

- Tokens in `base.css`: `--bg #0a0a0a`, `--fg #f4f4f0`, `--fg-muted` (55%),
  `--fg-faint` (30%), `--border-soft`, `--border-mid`; font Helvetica Neue/Arial.
- Big bold display headings with `clamp()`; small uppercase letter-spaced
  eyebrows/labels.
- Pill buttons: `.btn` (solid, primary CTA) and `.btn-outline` (secondary/pills).
- Motion: sections hold (pin) while content reveals, then release. Never pin
  during real interaction (forms, dragging, clicking through options).
- Mobile breakpoint is 768px (900px / 480px on the projects grid).

## GSAP / ScrollTrigger rules (learned the hard way)

1. Leave `pinSpacing` at its default (true) unless sections are meant to overlap.
2. Never tween the element you pin; animate an inner child instead.
3. Don't pin a parent whose height depends on a nested pinned child — give an
   exit beat its own fixed-height element (see `#explore-exit`).
4. Don't put two ScrollTriggers on the same element when one pins; fold the
   behaviour into one trigger's callbacks.
5. Never use `100vw` as a width/max-width safety net — it includes the
   scrollbar. Use `100%`.
6. Don't add `overflow-x: hidden` to `html`/`body`/pinned elements as a
   defensive fix — it spawns a second scroll container. Fix overflow at source.
7. For Draggable, use pixel-rectangle bounds from `getBoundingClientRect()`
   with a small inset, not element bounds. With `type: 'x,y'`, bounds are in
   transform space, so subtract the element's starting left/top
   (see `openCategory()` in `home.js`).
8. Pins are measured at creation — always refresh after fonts/assets settle.

## Known issues / backlog (as of Nov 2026)

- Homepage preloader takes ~9–10s: it waits on the 51MB showreel's
  `canplaythrough` and on `loading="lazy"` images that haven't started, so the
  8s timeout usually ends it.
- Heavy video: `twodudes-mv.mp4` 89MB, showreel 51MB, reels 12–51MB.
- About lines on the homepage are fixed `<div>`s, so they wrap awkwardly on phones.
- Explore canvas (540px) + heading is taller than short laptop viewports while pinned.
- Typo in `index.html`: `disablepictureinpicture0`.
- Commented-out `proj-icon` lines point to missing `assets/images/icons/icon-*.png`.
- Image folder names contain spaces (`cd rom`, `chur bol`, `foodbank nelson`,
  `game grimoire`, `tides under all`).
- Missing favicon, robots.txt, sitemap, Open Graph/social preview tags.

## Working conventions

- Ask before committing or pushing (pushing `main` deploys live).
- Ask before adding any dependency, build tool or framework.
- Verify changes in a real browser via a local server, at desktop and ~375px widths.
