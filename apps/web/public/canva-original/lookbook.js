(() => {
  const layout = document.querySelector('.lookbook-layout');
  if (!layout || typeof looks === 'undefined') return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const choices = document.createElement('div');
  choices.className = 'lookbook-choices';
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', 'Choisir un regard du lookbook');
  looks.forEach((look, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lookbook-choice';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-controls', 'lookbook-main-image lookbook-caption');
    const image = new Image();
    image.src = look.main[0]; image.alt = ''; image.loading = 'lazy';
    const label = document.createElement('span'); label.textContent = look.title;
    button.append(image, label);
    button.addEventListener('click', () => setLook(index));
    choices.append(button);
  });
  layout.before(choices);
  layout.tabIndex = 0;
  layout.setAttribute('role', 'region');
  layout.setAttribute('aria-label', 'Lookbook : utilisez les flèches pour changer de regard');
  const main = document.querySelector('.lookbook-main');
  const enlarge = document.createElement('button');
  enlarge.type = 'button'; enlarge.className = 'lookbook-enlarge';
  enlarge.textContent = 'Agrandir le regard';
  enlarge.setAttribute('aria-haspopup', 'dialog');
  main.append(enlarge);
  const viewer = document.createElement('dialog');
  viewer.className = 'lookbook-viewer';
  viewer.setAttribute('aria-labelledby', 'viewer-title');
  viewer.setAttribute('data-lenis-prevent', '');
  viewer.innerHTML = '<div class="viewer-header"><h2 id="viewer-title"></h2><button type="button" data-close aria-label="Fermer la vue agrandie">Fermer</button></div><img class="viewer-image" alt=""><div class="viewer-footer"><p>Photographie d’inspiration</p><div><button type="button" data-previous aria-label="Regard précédent">Précédent</button><button type="button" data-next aria-label="Regard suivant">Suivant</button></div></div>';
  document.body.append(viewer);
  let current = 0;
  function update() {
    [...choices.children].forEach((button, index) => button.setAttribute('aria-pressed', String(index === current)));
    viewer.querySelector('h2').textContent = looks[current].title;
    const image = viewer.querySelector('.viewer-image');
    image.src = looks[current].main[0]; image.alt = looks[current].main[1];
  }
  document.addEventListener('lookbook:change', event => {
    current = event.detail.index;
    update();
    if (!reduced.matches && layout.animate) layout.animate(
      [{ opacity: .55, clipPath: 'inset(0 1.5% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }],
      { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
  enlarge.addEventListener('click', () => {
    update(); viewer.showModal();
    document.dispatchEvent(new CustomEvent('lookbook:dialog', { detail: { open: true } }));
  });
  viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
  viewer.querySelector('[data-previous]').addEventListener('click', () => setLook(current - 1));
  viewer.querySelector('[data-next]').addEventListener('click', () => setLook(current + 1));
  viewer.addEventListener('close', () => {
    document.dispatchEvent(new CustomEvent('lookbook:dialog', { detail: { open: false } }));
    enlarge.focus({ preventScroll: true });
  });
  function keyboard(event) {
    if (event.target.closest('button') || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    setLook(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
  layout.addEventListener('keydown', keyboard);
  viewer.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); setLook(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  let start = null;
  main.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    start = { x: event.clientX, y: event.clientY };
  });
  main.addEventListener('pointercancel', () => { start = null; });
  main.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) setLook(current + (dx < 0 ? 1 : -1));
  });
  update();
})();
