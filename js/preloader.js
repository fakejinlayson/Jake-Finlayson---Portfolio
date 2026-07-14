/* ============================================================
   PRELOADER — shared across every page.
   Tracks real image/video loading on the page rather than a
   fake timer, since production pages will have actual assets
   to wait on. Falls back to a brief simulated load if a page
   has nothing to track (e.g. a very text-light page), so the
   preloader never gets stuck at 0%.

   Each page must define a global `window.initPage` function
   before this script runs (or before DOMContentLoaded) — it's
   called once the preloader finishes, and is where that page's
   own GSAP/ScrollTrigger setup should live.
   ============================================================ */

(function () {
  const pctEl = document.getElementById('pct');
  const barFill = document.getElementById('barFill');
  const preloaderEl = document.getElementById('preloader');
  let progress = 0;
  let targetProgress = 0;

  function setProgress(pct) {
    targetProgress = Math.min(100, pct);
  }

  // smooths the displayed percentage toward the real target rather
  // than jumping, since real asset loads can complete in clusters
  function tick() {
    if (progress < targetProgress) {
      progress = Math.min(targetProgress, progress + 2);
      pctEl.textContent = Math.floor(progress) + '%';
      barFill.style.width = progress + '%';
    }
    if (progress >= 100) {
      finishLoading();
      return;
    }
    requestAnimationFrame(tick);
  }

  function finishLoading() {
    if (typeof gsap === 'undefined') {
      preloaderEl.style.display = 'none';
      runInitPage();
      return;
    }
    gsap.to(preloaderEl, {
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      onComplete: () => {
        preloaderEl.style.display = 'none';
        runInitPage();
      }
    });
  }

  function runInitPage() {
    if (typeof window.initPage === 'function') {
      window.initPage();
    }
  }

  function trackRealAssets() {
    const images = Array.from(document.images);
    const videos = Array.from(document.querySelectorAll('video'));
    const total = images.length + videos.length;

    if (total === 0) {
      // nothing to track — fall back to a brief simulated load so
      // the preloader doesn't sit at 0% indefinitely
      const interval = setInterval(() => {
        setProgress(targetProgress + Math.random() * 25);
        if (targetProgress >= 100) clearInterval(interval);
      }, 100);
      return;
    }

    let loaded = 0;
    function markLoaded() {
      loaded += 1;
      setProgress((loaded / total) * 100);
    }

    images.forEach((img) => {
      if (img.complete) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded, { once: true });
        img.addEventListener('error', markLoaded, { once: true });
      }
    });

    videos.forEach((vid) => {
      if (vid.readyState >= 3) {
        markLoaded();
      } else {
        vid.addEventListener('canplaythrough', markLoaded, { once: true });
        vid.addEventListener('error', markLoaded, { once: true });
      }
    });

    // safety net — if something never fires its load/error event,
    // don't leave the visitor stuck behind the preloader forever
    setTimeout(() => setProgress(100), 8000);
  }

  trackRealAssets();
  requestAnimationFrame(tick);
})();
