(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
  function motion(element, frames, options) {
    if (!reduced.matches) element.animate?.(frames, { ...options, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  const hero = document.querySelector('.hero');
  let headerFrame = 0;
  function updateHeader() {
    headerFrame = 0;
    header.classList.toggle('is-at-top', scrollY < 60);
  }
  updateHeader();
  addEventListener('scroll', () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
  }, { passive: true });
  function entrance() {
    const lines = document.querySelectorAll('.headline-line');
    lines.forEach((line, index) => motion(line,
      [{ opacity: .1, clipPath: 'inset(0 0 100%)', transform: 'translateY(25px)' }, { opacity: 1, clipPath: 'inset(0)', transform: 'none' }],
      { duration: 850, delay: index * 120 }));
    motion(hero.querySelector('.hero-note'), [{ opacity: 0 }, { opacity: 1 }], { duration: 650, delay: 260 });
  }
  document.addEventListener('storefront:ready', entrance, { once: true });
  if (!document.querySelector('.site-loader')) entrance();

  // A click-driven editorial menu is equally available to mouse and keyboard.
  const toggle = document.getElementById('collection-menu-toggle');
  const menu = document.createElement('div');
  menu.id = 'collection-menu'; menu.className = 'mega-menu'; menu.hidden = true;
  menu.innerHTML = `<div class="mega-content"><div class="mega-links"><strong>Les univers</strong><a href="#collection" data-menu-universe="Femme">Femme</a><a href="#collection" data-menu-universe="Homme">Homme</a><a href="#collection" data-menu-category="Tout">Toutes les inspirations</a></div><div class="mega-links"><strong>Explorer par silhouette</strong>${['Robes','Vestes','Hauts','Pantalons'].map(category => `<a href="#collection" data-menu-category="${category}">${category}</a>`).join('')}</div><a class="mega-feature" href="#lookbook"><img src="${looks[0].main[0]}" alt="" loading="lazy"><div><strong>Le regard libre.</strong><span>Entrer dans le lookbook</span></div></a></div>`;
  header.append(menu);
  const backdrop = document.createElement('button');
  backdrop.className = 'mega-backdrop'; backdrop.hidden = true;
  backdrop.setAttribute('aria-label', 'Fermer le menu Explorer'); backdrop.tabIndex = -1;
  header.after(backdrop);
  function closeMenu(restore = false) {
    menu.hidden = true; backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-menu-open');
    if (restore) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false; backdrop.hidden = false;
    header.classList.add('is-menu-open'); toggle.setAttribute('aria-expanded', 'true');
    motion(menu, [{ opacity: .3, clipPath: 'inset(0 0 18%)' }, { opacity: 1, clipPath: 'inset(0)' }], { duration: 350 });
  });
  backdrop.addEventListener('click', () => closeMenu(true));
  menu.addEventListener('click', event => {
    const link = event.target.closest('a'); if (!link) return;
    if (link.dataset.menuCategory) {
      document.querySelector(`[data-filter="${link.dataset.menuCategory}"]`).click();
    } else if (link.dataset.menuUniverse) {
      document.querySelector(`.universe[data-universe="${link.dataset.menuUniverse}"]`).click();
    }
    closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
  });
  header.addEventListener('focusout', () => {
    queueMicrotask(() => { if (!header.contains(document.activeElement)) closeMenu(); });
  });
  matchMedia('(max-width: 800px)').addEventListener('change', () => closeMenu());

  // Every silhouette uses the existing catalog and the same favorite state.
  function enhanceCards() {
    document.querySelectorAll('#collection-grid .collection-card').forEach(card => {
      if (card.querySelector('.quick-view-button')) return;
      const favorite = card.querySelector('[data-favorite]');
      const item = inspirations.find(item => item.id === favorite?.dataset.favorite);
      if (!item) return;
      const related = inspirations.find(other => other.id !== item.id && other.category === item.category && other.universe === item.universe);
      if (related) {
        const alternate = new Image(); alternate.className = 'card-alternate'; alternate.src = related.src;
        alternate.alt = `Autre inspiration : ${related.title}`; alternate.loading = 'lazy';
        card.querySelector('.card-image-wrap').append(alternate);
      }
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'quick-view-button'; button.dataset.quickView = item.id;
      button.textContent = 'Découvrir la silhouette'; button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', `Découvrir ${item.title}`);
      card.querySelector('.card-image-wrap').append(button);
    });
  }
  document.addEventListener('storefront:cards', enhanceCards);
  enhanceCards();
  function createDialog(className, label) {
    const dialog = document.createElement('dialog');
    dialog.className = `luxury-dialog ${className}`;
    dialog.setAttribute('aria-labelledby', label);
    dialog.setAttribute('data-lenis-prevent', '');
    document.body.append(dialog);
    let returnFocus = null;
    dialog.addEventListener('close', () => {
      document.dispatchEvent(new CustomEvent('storefront:dialog', { detail: { open: false } }));
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    return { dialog, open(trigger = document.activeElement) {
      returnFocus = trigger;
      closeMenu();
      dialog.showModal();
      document.dispatchEvent(new CustomEvent('storefront:dialog', { detail: { open: true } }));
    } };
  }
  const quick = createDialog('quick-dialog', 'quick-title');
  quick.dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="Fermer l’aperçu">${closeIcon}</button><div class="quick-layout"><div class="quick-gallery"><img alt=""><button type="button" class="quick-zoom" aria-pressed="false">Voir le détail</button></div><div class="quick-copy"><p class="quick-category"></p><h2 id="quick-title"></h2><p>Un point de départ pour composer votre propre regard. Conservez cette silhouette et retrouvez-la dans votre carnet d’inspiration.</p><button class="quick-save" type="button" aria-pressed="false"></button><div class="quick-facts">Photographie d’inspiration · Pièce non proposée à la vente.<br>Tailles, matières et prix non renseignés.</div></div></div>`;
  quick.dialog.querySelector('.dialog-close').addEventListener('click', () => quick.dialog.close());
  let activeItem = null;
  const quickSave = quick.dialog.querySelector('.quick-save');
  function syncQuick() {
    if (!activeItem) return;
    const saved = favorites.has(activeItem.id);
    quickSave.setAttribute('aria-pressed', String(saved));
    quickSave.textContent = saved ? 'Retirer de mon carnet' : 'Ajouter à mon carnet';
  }
  document.getElementById('collection-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-quick-view]'); if (!button) return;
    activeItem = inspirations.find(item => item.id === button.dataset.quickView);
    quick.dialog.querySelector('h2').textContent = activeItem.title;
    quick.dialog.querySelector('.quick-category').textContent = `${activeItem.category} · ${activeItem.universe}`;
    const image = quick.dialog.querySelector('.quick-gallery img');
    image.src = activeItem.src; image.alt = activeItem.alt;
    quick.dialog.querySelector('.quick-gallery').classList.remove('is-zoomed');
    const zoom = quick.dialog.querySelector('.quick-zoom'); zoom.setAttribute('aria-pressed', 'false'); zoom.textContent = 'Voir le détail';
    syncQuick(); quick.open(button);
  });
  quickSave.addEventListener('click', () => { if (activeItem) toggleFavorite(activeItem.id); });
  quick.dialog.querySelector('.quick-zoom').addEventListener('click', event => {
    const zoomed = quick.dialog.querySelector('.quick-gallery').classList.toggle('is-zoomed');
    event.currentTarget.setAttribute('aria-pressed', String(zoomed));
    event.currentTarget.textContent = zoomed ? 'Voir la silhouette' : 'Voir le détail';
  });

  const drawer = createDialog('selection-drawer', 'drawer-title');
  drawer.dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="Fermer ma sélection">${closeIcon}</button><h2 id="drawer-title">Votre regard,<br>votre carnet.</h2><p class="drawer-note">Les silhouettes que vous avez choisies, réunies au même endroit.</p><div class="drawer-content"></div><div class="drawer-actions"><button type="button" class="drawer-notebook">Ouvrir mon carnet</button><button type="button" class="drawer-browse">Continuer l’exploration</button></div><p class="storage-note"></p>`;
  drawer.dialog.querySelector('.dialog-close').addEventListener('click', () => drawer.dialog.close());
  function syncDrawer() {
    const chosen = inspirations.filter(item => favorites.has(item.id));
    const content = drawer.dialog.querySelector('.drawer-content');
    if (!chosen.length) content.innerHTML = '<div class="drawer-empty"><p>Votre prochaine inspiration<br>est à portée de regard.</p></div>';
    else content.innerHTML = `<ul class="drawer-list">${chosen.map(item => `<li><img src="${item.src}" alt="${escapeHTML(item.alt)}" loading="lazy"><div><h3>${escapeHTML(item.title)}</h3><p>${item.category} · ${item.universe}</p></div><button type="button" data-drawer-remove="${item.id}" aria-label="Retirer ${escapeHTML(item.title)}">${closeIcon}</button></li>`).join('')}</ul>`;
    drawer.dialog.querySelector('.drawer-notebook').disabled = !chosen.length;
    drawer.dialog.querySelector('.storage-note').textContent = favoritesStorageAvailable
      ? 'Votre sélection est conservée dans ce navigateur. Photographies d’inspiration, sans offre de vente.'
      : 'Stockage indisponible : votre sélection reste accessible pendant cette visite.';
  }
  document.querySelectorAll('a.nav-selection').forEach(link => {
    link.addEventListener('click', event => { event.preventDefault(); syncDrawer(); drawer.open(link); });
  });
  drawer.dialog.addEventListener('click', event => {
    const remove = event.target.closest('[data-drawer-remove]');
    if (remove) {
      const buttons = [...drawer.dialog.querySelectorAll('[data-drawer-remove]')];
      const index = buttons.indexOf(remove);
      toggleFavorite(remove.dataset.drawerRemove);
      const remaining = drawer.dialog.querySelectorAll('[data-drawer-remove]');
      (remaining[Math.min(index, remaining.length - 1)] || drawer.dialog.querySelector('.drawer-browse')).focus();
    }
  });
  drawer.dialog.querySelector('.drawer-browse').addEventListener('click', () => {
    drawer.dialog.close(); document.getElementById('collection').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  drawer.dialog.querySelector('.drawer-notebook').addEventListener('click', () => {
    drawer.dialog.close(); openCarnet();
    // The original carnet must return focus to a visible header control.
    lastFocus = document.querySelector('.desktop-nav .nav-selection');
    if (getComputedStyle(lastFocus).display === 'none' || innerWidth <= 800) lastFocus = document.getElementById('menu-toggle');
  });
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.hidden = true; toast.setAttribute('role', 'status');
  document.body.append(toast);
  let toastTimeout = 0;
  document.addEventListener('storefront:selection', event => {
    syncQuick(); syncDrawer();
    toast.textContent = event.detail.saved ? 'Inspiration ajoutée à votre carnet.' : 'Inspiration retirée de votre carnet.';
    toast.hidden = false; clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 2400);
    const button = document.querySelector(`[data-favorite="${event.detail.id}"]`);
    if (button) {
      button.classList.remove('is-confirming');
      requestAnimationFrame(() => button.classList.add('is-confirming'));
    }
    const count = document.querySelector('.desktop-nav .count');
    motion(count, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 260 });
  });

  // Replace an unfinished content placeholder with an existing editorial asset.
  const placeholder = document.querySelector('.about .placeholder');
  if (placeholder) {
    const figure = document.createElement('figure'); figure.className = 'about-art';
    figure.innerHTML = `<img src="${looks[0].detail[0]}" alt="Plis d’un tissu beige — détail photographique d’inspiration" loading="lazy"><figcaption>Les lignes, jusque dans le détail.</figcaption>`;
    placeholder.replaceWith(figure);
  }
  const faqSelection = document.querySelectorAll('.faq details p')[1];
  if (faqSelection) faqSelection.textContent = 'Réunissez les inspirations qui vous plaisent, puis ouvrez votre carnet pour les retrouver. Vos choix sont conservés dans ce navigateur lorsque le stockage est disponible.';
  // Keep the same fallback if a preference changes while a dialog is open.
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.getAnimations().forEach(animation => animation.cancel());
    if (document.querySelector('dialog[open]')) document.dispatchEvent(new CustomEvent('storefront:dialog', { detail: { open: true } }));
  });
})();
