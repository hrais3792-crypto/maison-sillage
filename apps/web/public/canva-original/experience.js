(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const loader = document.createElement('div');
  loader.className = 'site-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'Chargement de Maison Sillage');
  loader.innerHTML = '<strong>Maison Sillage</strong><div class="loader-track" aria-hidden="true"></div><span>Votre inspiration prend place.</span>';
  document.body.prepend(loader);
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    loader.classList.add('is-complete');
    document.dispatchEvent(new CustomEvent('storefront:ready'));
    setTimeout(() => loader.remove(), 450);
  }
  // Never wait for lazy images below the fold or indefinitely for a failed asset.
  const timeout = setTimeout(finish, 3500);
  const hero = document.getElementById('hero-image');
  const heroReady = hero?.decode ? hero.decode().catch(() => {}) : Promise.resolve();
  Promise.all([heroReady, document.fonts?.ready]).then(() => {
    clearTimeout(timeout);
    finish();
  });
  addEventListener('pagehide', finish, { once: true });

  const imageRequests = new WeakMap();
  function trackImage(image) {
    if (!image.getAttribute('src')) return;
    imageRequests.get(image)?.cleanup();
    const request = { cleanup() {} };
    imageRequests.set(image, request);
    image.decoding = 'async';
    const optimized = image.getAttribute('src')?.match(/\/optimized\/(\d+)-1280\.jpg$/);
    if (optimized) {
      const base = `/canva-original/optimized/${optimized[1]}`;
      image.srcset = `${base}-640.jpg 640w, ${base}-1280.jpg 1280w, ${base}-1920.jpg 1920w`;
      image.sizes = image.closest('.collection-card') ? '(max-width: 600px) 85vw, (max-width: 800px) 44vw, 30vw'
        : image.closest('.lookbook-choice') ? '100px'
        : '(max-width: 600px) 100vw, 60vw';
    } else if (image.hasAttribute('srcset')) {
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
    }
    image.classList.add('is-image-loading');
    const src = image.getAttribute('src');
    let settled = false;
    image.parentElement?.querySelector('.image-load-error')?.remove();
    function settle() {
      if (settled || !image.complete || imageRequests.get(image) !== request || image.getAttribute('src') !== src) return;
      settled = true;
      request.cleanup();
      image.classList.remove('is-image-loading');
      image.classList.add('is-image-ready');
      if (!image.naturalWidth) {
        const error = document.createElement('span');
        error.className = 'image-load-error';
        error.textContent = 'Visuel indisponible. Rechargez la page pour réessayer.';
        error.setAttribute('role', 'status');
        image.parentElement?.append(error);
      }
    }
    request.cleanup = () => {
      image.removeEventListener('load', settle);
      image.removeEventListener('error', settle);
    };
    image.addEventListener('load', settle, { once: true });
    image.addEventListener('error', settle, { once: true });
    // Responsive source selection can lag behind src changes by a microtask.
    // Decode waits for that request instead of reusing a stale failed state.
    if (image.complete) {
      if (image.decode) image.decode().then(settle, settle);
      else queueMicrotask(settle);
    }
  }
  document.querySelectorAll('img').forEach(trackImage);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') trackImage(record.target);
      for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches('img')) trackImage(node);
        node.querySelectorAll('img').forEach(trackImage);
      }
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  let smooth = null;
  function configureScroll() {
    smooth?.destroy();
    smooth = null;
    if (preference.matches || typeof window.Lenis !== 'function') return;
    smooth = new window.Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.09,
      syncTouch: false,
      anchors: { offset: -86, duration: 1.05 },
      prevent: node => node.closest?.('.carnet-overlay, .mobile-nav'),
    });
  }
  configureScroll();
  preference.addEventListener('change', configureScroll);
  document.addEventListener('storefront:dialog', event => {
    if (event.detail.open) smooth?.stop();
    else if (!document.querySelector('dialog[open]') && !document.getElementById('carnet-overlay')?.classList.contains('open')) smooth?.start();
  });
  document.addEventListener('lookbook:dialog', event => {
    if (event.detail.open) smooth?.stop();
    else if (!document.getElementById('carnet-overlay')?.classList.contains('open')) smooth?.start();
  });
  const overlay = document.getElementById('carnet-overlay');
  if (overlay) new MutationObserver(() => {
    if (overlay.classList.contains('open')) smooth?.stop();
    else smooth?.start();
  }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
})();
