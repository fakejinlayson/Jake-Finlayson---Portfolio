# Handoff: Jake Finlayson portfolio rebuild

This document summarizes a Claude.ai conversation where we designed and
prototyped a new scroll-choreographed portfolio homepage, and started
extracting shared foundations for a multi-page site rebuild. It's meant
to give a fresh Claude Code session full context without needing the
original chat history.

## Project goal

Rebuild jakefinlayson.co.nz (currently a basic video-carousel homepage)
in the style of alche.studio and 109ichiki.com — Astro/GSAP-driven sites
with heavy scroll-choreography (pinned sections, scrubbed reveals,
horizontal marquee breaks). Jake is "mostly HTML/CSS, light JS" skill
level, so the build favors readable, well-commented vanilla JS + GSAP
over a framework, even though Astro was the original inspiration-sites'
likely stack.

Tech stack: plain HTML/CSS/JS files, no build step, no framework.
GSAP 3.12.5 + ScrollTrigger + Draggable, loaded via cdnjs CDN.
Jake's live site uses this same "plain files, FTP/upload deploy" model.

## Current state of files in this folder

- `index.html` — the homepage. **Fully working, single-file** (CSS and
  JS are inline in `<style>`/`<script>` tags, not yet split out). This
  has been through many rounds of bug-fixing in the original
  conversation (see "Bugs encountered" below) — it works correctly as
  of this handoff.
- `css/base.css` — extracted shared styles (reset, color tokens as CSS
  variables, nav, preloader, buttons, footer) meant to be shared across
  every page of the site.
- `js/site-helpers.js` — extracted reusable GSAP patterns (plugin
  registration, nav entrance, a `pinSection()` helper, a `lineReveal()`
  helper matching the About section's text animation).
- `js/preloader.js` — shared preloader script, upgraded from the
  prototype's original fake-timer version to track real image/video
  loading via `document.images` and `<video>` `canplaythrough` events,
  with a fallback simulated load for pages with nothing to track.
- `_template.html` — a reference skeleton (not a real page) showing the
  intended structure every new page should follow: links to
  `css/base.css` + a page-specific stylesheet, loads
  `site-helpers.js` → page's own script → `preloader.js` last (since
  preloader.js calls `window.initPage()` once it finishes, so that
  function must already be defined).

## ⚠️ Known unfinished step — do this first

**`index.html` has NOT yet been refactored to use `base.css` /
`site-helpers.js` / `preloader.js`.** It still has everything inline.
The extraction was started (those three files exist and are believed
correct) but never actually wired into `index.html` and verified,
because the chat-based artifact preview can't render multi-file
relative-path setups (see "Why we're in Claude Code now" below).

The first task should be: refactor `index.html` to link the external
`css/base.css` and `js/*.js` files instead of inline blocks, move
homepage-specific styles into a new `css/home.css`, move
homepage-specific script into a new `js/home.js` that defines
`window.initPage`, and **verify it still renders and behaves
identically** before touching any other page. This is exactly the kind
of multi-file verification that wasn't possible in the chat artifact
environment, which is the whole reason for this handoff.

## Folder structure convention

Flat — matches Jake's actual live site. All HTML pages
(`index.html`, `about.html`, `projects.html`, `contact.html`) sit at
the project root, next to `css/` and `js/` folders. No subfolders per
page. This was a real bug earlier (see below) — don't reintroduce
nesting.

## Site map / pages still to build

1. **index.html** — done (homepage), pending the refactor above.
2. **about.html** — not started. Should reuse real content from Jake's
   existing live About page:
   - Bio: started creating at 5 (first book), board games at 8,
     programming/music production at 13. Bachelor of Software
     Engineering (Game Programming major) at Media Design School,
     Diploma in Creative Marketing at Yoobee.
   - Experience: Marketing Assistant (two dudes, 2025–current), Social
     Media Coordinator (Hato Hone St John), freelance marketing/video
     work for several NZ businesses, Livestream Producer for Scrabble
     NZ, VR Support & Video Editor at Waxeye, Game Dev Tutor, Game
     Developer Intern at CerebralFix, Music Producer (self-employed,
     2020–current).
   - The prototype's homepage About *section* (pinned, line-reveal,
     draggable skill icons over a photo) already has a compressed
     version of this bio written in Jake's voice — can be reused/
     expanded for the dedicated About page, just longer-form.
   - Agreed direction: visual language (dark theme, fonts, nav, button
     styles) carries over; doesn't necessarily need the same heavy
     pin/reveal choreography as the homepage, though could reuse
     `lineReveal()` from site-helpers.js if desired.
3. **projects.html** — not started. Jake wants this to reuse/adapt the
   homepage's "explore" window-manager pattern (draggable, Mac-style-
   chrome windows scattered on a bounded canvas) for showing individual
   project case studies — this is a much better fit for that pattern
   than the generic category-demo it currently is, since each project
   is a discrete, draggable "window" naturally.
4. **contact.html** — not started. No specific direction given yet
   beyond matching the visual language.

## Hard-won bugs and lessons from the original build (read before touching ScrollTrigger code)

These cost real debugging time in the original conversation — worth
internalizing before modifying any pinned/scrubbed section.

1. **`pinSpacing: false` causes section overlap** unless sections are
   deliberately meant to stack/overlap. Default (`pinSpacing: true`,
   i.e. omit the property) reserves proper scroll-lane space for each
   pinned section so the next one doesn't slide in underneath it
   early.

2. **Never animate a pinned element directly.** If `#foo` is the
   `trigger`/pin target of a `ScrollTrigger`, don't also run a
   separate `gsap.to('#foo', {...})` on it — GSAP's internal pin
   positioning fights with the manual tween and causes a sudden
   "snap" instead of a smooth scrub. Always wrap pinned content's
   fadeable/animatable parts in an inner child element and animate
   that instead.

3. **Pinning a parent whose height depends on a nested pinned child
   is fragile** (documented GSAP community issue — empty-gap / wrong-
   height bugs). If you need a pinned "exit beat" near the end of a
   section that itself contains a pinned child, give the exit beat its
   own separate, fixed-height element to pin — don't pin the section
   wrapper itself.

4. **Two independent `ScrollTrigger`s on the same trigger element can
   be unreliable** if one of them also has `pin: true` — the pinned
   one alters the element's measured geometry, and a second trigger
   watching the same element (especially with no explicit `end`) may
   fail to fire its callbacks correctly. Fold multiple things you want
   to happen "while this section is active" into ONE trigger's
   callbacks rather than creating several triggers on the same
   element.

5. **`100vw` is wider than the visible content area whenever a
   vertical scrollbar is present** (it includes the scrollbar's own
   width; `100%` does not). Never use `100vw` as a `max-width` safety
   net on an inner element — use `100%`. This caused a real "phantom
   second scrollbar" bug.

6. **Setting `overflow-x: hidden` without pairing it with an explicit
   `overflow-y` value, especially on root `html`/`body` or on a pinned
   element, can cause the browser to compute its own value for the
   other axis** and spin up an unexpected separate scroll
   container/scrollbar. This was tried twice as a "defensive" fix and
   caused the exact problem it was meant to prevent both times. If
   horizontal overflow is a risk, fix it at the source (e.g. proper
   Draggable bounds) rather than masking it with a root-level overflow
   rule.

7. **GSAP Draggable's `bounds: someElement` (element-based bounds) has
   documented edge-case unreliability at right/bottom edges.** Prefer
   explicit pixel-rectangle bounds calculated from the target
   container's actual measured `getBoundingClientRect()`, with a small
   inset (a few px) to account for box-shadow bleed on the dragged
   element. See the `openCategory()` function in `index.html` for the
   working pattern.

8. **GSAP measures pinned elements' dimensions once, at
   `ScrollTrigger.create()` time.** If layout shifts afterward (web
   fonts loading async being the most common cause), that pin's
   spacer can be locked in with stale/wrong dimensions for its entire
   lifecycle. Fix: call `ScrollTrigger.refresh()` after
   `requestAnimationFrame`, `window.load`, AND `document.fonts.ready`
   — see the end of `initPage()` in `index.html`.

9. **Artifact/chat preview cannot render multi-file relative-path
   setups** (e.g. `<link href="css/base.css">` silently fails to load
   in that environment, producing unstyled default HTML with no
   visible error). This isn't a code bug — it's why this project moved
   to Claude Code. Don't be alarmed if early local testing in a
   different environment shows something that looks broken in a way
   that doesn't match the actual code; verify against a real browser
   with a real adjacent filesystem (or a local dev server) instead.

## Design language reference (for building remaining pages)

- Dark theme: `--bg: #0a0a0a`, `--fg: #f4f4f0`, muted text at ~55%
  opacity of `--fg`.
- Typography: Helvetica Neue/Arial, large bold display type for
  headings (`clamp()`-based responsive sizing), uppercase
  letter-spaced small text for eyebrows/labels/nav.
- Buttons: pill-shaped, two variants — solid (`.btn`, light bg/dark
  text, used for primary CTAs) and outline (`.btn-outline`, used for
  category pills/secondary actions).
- Motion: sections "hold" (pin) briefly while their content reveals
  via scrubbed fade/slide, then release — never pin during actual user
  interaction (forms, dragging, clicking through options).
- Nav uses `mix-blend-mode: difference` so it stays legible over any
  background.

## Suggested first Claude Code session tasks, in order

1. Verify `index.html` still works as a single file (open directly in
   a browser) before changing anything, to confirm the working
   baseline.
2. Do the CSS/JS extraction refactor described above (split into
   `css/home.css` + `js/home.js`, wire up the shared files), verify it
   still renders/behaves identically.
3. Build `about.html` using the real bio/experience content listed
   above.
4. Build `projects.html`, adapting the window-manager drag pattern
   from `index.html`'s explore section for project case studies.
5. Build `contact.html`.
6. Pass on mobile/responsive behavior — explicitly NOT addressed yet
   anywhere in this project. Pinned sections, draggable windows, and
   the About photo's icon drag bounds are all desktop-viewport
   assumptions currently.
