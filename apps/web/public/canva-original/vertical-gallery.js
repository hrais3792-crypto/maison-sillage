(() => {
  const collection = document.getElementById('univers');
  if (!collection || typeof inspirations === 'undefined') return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const section = document.createElement('section');
  section.id = 'defile';
  section.className = 'vertical-gallery';
  section.setAttribute('aria-labelledby', 'defile-title');
  section.innerHTML = '<div class="vertical-gallery-copy"><h2 id="defile-title">Les allures <em>défilent.</em></h2><p>Un mouvement continu. Des silhouettes qui se croisent, des idées à retenir.</p><a href="#collection">Explorer les silhouettes</a><div class="vertical-gallery-controls"><button type="button" aria-pressed="false" aria-controls="defile-images"></button></div></div><div class="lift-images" id="defile-images" role="group" aria-label="Photographies d’inspiration en défilement vertical"></div>';
  const images = section.querySelector('.lift-images');
  // Equal original/duplicate group heights make the seam invisible.
  [[0, 2, 6], [1, 5, 8]].forEach(indices => {
    const column = document.createElement('div'); column.className = 'lift-column';
    const track = document.createElement('div'); track.className = 'lift-track';
    const group = document.createElement('div'); group.className = 'lift-group';
    indices.forEach(index => {
      const item = inspirations[index];
      if (!item) return;
      const figure = document.createElement('figure');
      const image = new Image(); image.src = item.src; image.alt = item.alt;
      image.loading = 'lazy'; image.decoding = 'async';
      const caption = document.createElement('figcaption'); caption.textContent = item.title;
      figure.append(image, caption); group.append(figure);
    });
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true'); duplicate.inert = true;
    duplicate.querySelectorAll('img').forEach(image => { image.alt = ''; });
    track.append(group, duplicate); column.append(track); images.append(column);
  });
  collection.before(section);
  const button = section.querySelector('button');
  let paused = false;
  function sync() {
    section.classList.toggle('is-paused', paused || reduced.matches);
    button.disabled = reduced.matches;
    button.setAttribute('aria-pressed', String(paused || reduced.matches));
    const label = reduced.matches ? 'Animation désactivée' : paused ? 'Reprendre le défilement' : 'Mettre en pause';
    const path = paused ? '<path d="m8 5 11 7-11 7Z"/>' : '<path d="M8 5v14M16 5v14"/>';
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${path}</svg><span>${label}</span>`;
  }
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  function visibility() {
    section.classList.toggle('is-running', visible && !document.hidden);
  }
  let visible = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    visibility();
  }, { threshold: .05 }).observe(section);
  // Without viewport observation the safe fallback is a static gallery.
  document.addEventListener('visibilitychange', visibility);
  images.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') section.classList.add('is-touch-paused');
  }, { passive: true });
  function release() { section.classList.remove('is-touch-paused'); }
  addEventListener('pointerup', release, { passive: true });
  addEventListener('pointercancel', release, { passive: true });
  addEventListener('blur', release);
  sync();
})();
