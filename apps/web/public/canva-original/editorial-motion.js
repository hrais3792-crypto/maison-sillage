(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const ease = 'cubic-bezier(.16, 1, .3, 1)';
  const animations = new Set();
  function animate(element, frames, options) {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  }

  // One bounded scroll update, shared by native scrolling and Lenis.
  const hero = document.querySelector('.hero');
  const heroImage = document.getElementById('hero-image');
  let parallaxFrame = 0;
  function paintParallax() {
    parallaxFrame = 0;
    if (!heroImage || !hero) return;
    if (reduced.matches || innerWidth <= 600) { heroImage.style.transform = ''; return; }
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const distance = Math.max(-1, Math.min(1, -rect.top / rect.height));
    heroImage.style.transform = `translate3d(0, ${distance * rect.height * .07}px, 0) scale(1.16)`;
  }
  function scheduleParallax() {
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(paintParallax);
  }
  addEventListener('scroll', scheduleParallax, { passive: true });
  addEventListener('resize', scheduleParallax, { passive: true });
  scheduleParallax();

  // Content stays visible before enhancement and if any script fails.
  const seen = new WeakSet();
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      revealObserver.unobserve(entry.target);
      animate(entry.target,
        [{ opacity: .3, clipPath: 'inset(0 0 12% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)' }],
        { duration: 650, easing: ease });
    }
  }, { threshold: .12 }) : null;
  function observeReveals(root) {
    root.querySelectorAll('.universe, .section-heading, .lookbook-main, .lookbook-side, .about .container, .collection-card').forEach(element => {
      if (seen.has(element)) return;
      seen.add(element);
      revealObserver?.observe(element);
    });
  }
  observeReveals(document);

  const grid = document.getElementById('collection-grid');
  if (grid) {
    grid.classList.add('product-carousel');
    grid.tabIndex = 0;
    grid.setAttribute('role', 'region');
    grid.setAttribute('aria-roledescription', 'carrousel');
    grid.setAttribute('aria-label', 'Inspirations de la collection');
    const controls = document.createElement('div');
    controls.className = 'carousel-navigation';
    const arrow = direction => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${direction === 'previous' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'}"/></svg>`;
    controls.innerHTML = `<span class="carousel-position" role="status" aria-live="polite"></span><div class="carousel-buttons"><button type="button" data-slide="previous" aria-label="Inspirations précédentes" aria-controls="collection-grid">${arrow('previous')}</button><button type="button" data-slide="next" aria-label="Inspirations suivantes" aria-controls="collection-grid">${arrow('next')}</button></div>`;
    grid.after(controls);
    const previous = controls.querySelector('[data-slide="previous"]');
    const next = controls.querySelector('[data-slide="next"]');
    const position = controls.querySelector('.carousel-position');
    function updateCarousel() {
      const cards = [...grid.querySelectorAll('.collection-card')];
      const rect = grid.getBoundingClientRect();
      const visible = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index }))
        .filter(card => card.rect.left < rect.right - 20 && card.rect.right > rect.left + 20);
      const text = visible.length ? `${visible[0].index + 1}–${visible.at(-1).index + 1} / ${cards.length} inspirations` : 'Aucune inspiration';
      if (position.textContent !== text) position.textContent = text;
      previous.disabled = grid.scrollLeft < 2;
      next.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
      controls.hidden = !cards.length;
    }
    function slide(direction) {
      const card = grid.querySelector('.collection-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(grid).columnGap) || 18;
      grid.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reduced.matches ? 'instant' : 'smooth' });
    }
    previous.addEventListener('click', () => slide(-1));
    next.addEventListener('click', () => slide(1));
    grid.addEventListener('keydown', event => {
      if (event.target !== grid || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home' || event.key === 'End') grid.scrollTo({ left: event.key === 'Home' ? 0 : grid.scrollWidth, behavior: reduced.matches ? 'instant' : 'smooth' });
      else slide(event.key === 'ArrowLeft' ? -1 : 1);
    });
    let carouselFrame = 0;
    grid.addEventListener('scroll', () => {
      if (!carouselFrame) carouselFrame = requestAnimationFrame(() => { carouselFrame = 0; updateCarousel(); });
    }, { passive: true });
    new ResizeObserver(updateCarousel).observe(grid);
    new MutationObserver(() => {
      grid.scrollTo({ left: 0, behavior: 'instant' });
      observeReveals(grid);
      requestAnimationFrame(updateCarousel);
    }).observe(grid, { childList: true });
    updateCarousel();
  }

  // An accompanying ring preserves the native cursor and precise text selection.
  const cursor = document.createElement('div');
  cursor.className = 'editorial-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M7 7h10v10"/></svg>';
  document.body.append(cursor);
  let cursorFrame = 0, pointerX = 0, pointerY = 0;
  document.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || event.pointerType !== 'mouse') return;
    pointerX = event.clientX; pointerY = event.clientY;
    const action = !!event.target.closest('a, button');
    const field = !!event.target.closest('input, textarea, select');
    cursor.classList.toggle('is-visible', !field);
    cursor.classList.toggle('is-action', action);
    if (!cursorFrame) cursorFrame = requestAnimationFrame(() => {
      cursorFrame = 0;
      cursor.style.transform = `translate3d(${pointerX - 17}px, ${pointerY - 17}px, 0)`;
    });
  }, { passive: true });
  function hideCursor() { cursor.classList.remove('is-visible'); }
  document.documentElement.addEventListener('pointerleave', hideCursor);
  document.addEventListener('keydown', hideCursor);
  addEventListener('blur', hideCursor);
  finePointer.addEventListener('change', hideCursor);
  reduced.addEventListener('change', () => {
    hideCursor();
    if (reduced.matches) {
      animations.forEach(animation => animation.cancel());
      if (heroImage) heroImage.style.transform = '';
    } else scheduleParallax();
  });
})();
