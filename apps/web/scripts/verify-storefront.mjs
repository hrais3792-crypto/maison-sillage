// Connect to an isolated Chrome started with --remote-debugging-port=9334.
// CDP_URL, SITE_URL and SCREENSHOT_DIR can override the local defaults.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const site = process.env.SITE_URL || 'http://127.0.0.1:5173/';
const cdp = process.env.CDP_URL || 'http://127.0.0.1:9334';
const screenshots = process.env.SCREENSHOT_DIR || join(tmpdir(), 'maison-sillage-review');
await mkdir(screenshots, { recursive: true });
const tabs = await (await fetch(`${cdp}/json`)).json();
const page = tabs.find(tab => tab.type === 'page');
if (!page) throw new Error('No Chrome page available');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 12000);
    pending.set(id, message => {
      clearTimeout(timeout);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'Evaluation failed');
  return result.result.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function check(expression, name) {
  if (!await evaluate(expression)) throw new Error(name);
  console.log(`PASS ${name}`);
}
async function click(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await pause(100);
}
async function screenshot(name) {
  await pause(450);
  const result = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(join(screenshots, `${name}.png`), Buffer.from(result.data, 'base64'));
}
async function viewport(width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
  await send('Emulation.setTouchEmulationEnabled', { enabled: width < 600 });
}
async function escape() {
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await pause(100);
}
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await viewport(1440);
  await send('Page.navigate', { url: site });
  await pause(3800);
  await evaluate(`localStorage.removeItem('maison-sillage-editorial-favorites')`);
  await send('Page.reload'); await pause(3800);
  await check(`!document.querySelector('.site-loader') && document.querySelectorAll('.quick-view-button').length === 9`, 'Page ready, all nine inspirations enhanced');
  await check(`document.querySelector('.site-header').classList.contains('is-at-top')`, 'Transparent header at top');
  await check(`document.querySelector('h1').textContent.includes('liberté')`, 'French typography preserved');
  await screenshot('desktop-hero');
  await click('#collection-menu-toggle');
  await check(`!document.getElementById('collection-menu').hidden`, 'Editorial menu opens');
  await screenshot('desktop-menu');
  await escape();
  await check(`document.getElementById('collection-menu').hidden && document.activeElement.id === 'collection-menu-toggle'`, 'Menu Escape restores focus');
  await click('#collection-menu-toggle');
  await click('[data-menu-category="Robes"]');
  await check(`document.querySelectorAll('#collection-grid .collection-card').length === 2`, 'Mega menu filters real catalog');
  await click('[data-filter="Tout"]');
  await evaluate(`document.getElementById('collection').scrollIntoView({behavior:'instant'})`);
  await pause(500);
  await check(`!document.querySelector('.site-header').classList.contains('is-at-top')`, 'Solid header after scrolling');
  await screenshot('desktop-collection');
  await click('.quick-view-button');
  await check(`document.querySelector('.quick-dialog').open && document.getElementById('quick-title').textContent === 'Ligne en mouvement'`, 'Quick view opens correct inspiration');
  await click('.quick-zoom');
  await check(`document.querySelector('.quick-gallery').classList.contains('is-zoomed')`, 'Gallery detail zoom');
  await click('.quick-save');
  await check(`document.getElementById('selection-count').textContent === '1' && document.querySelector('.quick-save').getAttribute('aria-pressed') === 'true'`, 'Quick view saves real favorite');
  await screenshot('desktop-quick-view');
  await escape();
  await check(`document.activeElement.classList.contains('quick-view-button')`, 'Quick view restores focus');
  await click('.desktop-nav .nav-selection');
  await check(`document.querySelector('.selection-drawer').open && document.querySelectorAll('.drawer-list li').length === 1`, 'Selection drawer contains saved inspiration');
  await screenshot('desktop-drawer');
  await click('.drawer-notebook');
  await check(`document.getElementById('carnet-overlay').classList.contains('open') && document.querySelectorAll('#carnet-items article').length === 1`, 'Drawer opens existing printable notebook');
  await screenshot('desktop-notebook');
  await click('#carnet-close');
  await send('Page.reload'); await pause(1500);
  await check(`document.getElementById('selection-count').textContent === '1'`, 'Favorites survive reload');
  await click('.desktop-nav .nav-selection');
  await click('[data-drawer-remove]');
  await check(`document.querySelector('.drawer-notebook').disabled && document.getElementById('selection-count').textContent === '0'`, 'Remove updates drawer, header and empty state');
  await escape();
  await click('[data-favorite="robe-fluide"]');
  await click('[data-favorite="veste-structuree"]');
  await evaluate(`document.querySelector('#selection-content [data-remove]').focus()`);
  await click('#selection-content [data-remove]');
  await check(`document.activeElement.dataset.remove === 'veste-structuree'`, 'On-page removal focuses remaining item');
  await click('#selection-content [data-remove]');
  await check(`document.activeElement === document.querySelector('#selection-content .outline-button')`, 'Last on-page removal focuses exploration link');
  await evaluate(`document.getElementById('lookbook').scrollIntoView({behavior:'instant'})`);
  await click('.lookbook-choice:nth-child(3)');
  await check(`document.getElementById('lookbook-main-image').getAttribute('src') === '/images/homme-classique-chemise.jpg' && !document.getElementById('lookbook-main-image').hasAttribute('srcset')`, 'Lookbook changes source without stale responsive image');
  await click('.lookbook-enlarge');
  await check(`document.querySelector('.lookbook-viewer').open`, 'Lookbook enlarged view');
  await escape();
  await screenshot('desktop-lookbook');
  for (const width of [320, 390, 768, 1034, 1440]) {
    await viewport(width);
    await pause(250);
    await check(`document.documentElement.scrollWidth <= innerWidth`, `No horizontal overflow at ${width}px`);
  }
  await viewport(390);
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`); await pause(200);
  await screenshot('mobile-hero');
  await check(`document.getElementById('hero-image').style.transform === ''`, 'Mobile parallax disabled');
  await click('#menu-toggle');
  await check(`document.getElementById('mobile-nav').classList.contains('open')`, 'Mobile navigation opens');
  await screenshot('mobile-menu');
  await click('#mobile-nav a[href="#collection"]');
  await check(`!document.getElementById('mobile-nav').classList.contains('open')`, 'Mobile navigation closes on selection');
  await evaluate(`document.getElementById('collection').scrollIntoView({behavior:'instant'})`);
  await pause(500);
  await click('[data-slide="next"]'); await pause(750);
  await check(`document.getElementById('collection-grid').scrollLeft > 100`, 'Mobile carousel advances');
  await screenshot('mobile-collection');
  await click('.quick-view-button');
  await check(`document.querySelector('.quick-dialog').open && document.querySelector('.quick-dialog').scrollWidth <= document.querySelector('.quick-dialog').clientWidth`, 'Mobile quick view fits');
  await screenshot('mobile-quick-view'); await escape();
  await evaluate(`document.getElementById('faq').scrollIntoView({behavior:'instant'})`);
  await click('.faq summary');
  await check(`document.querySelector('.faq details').open`, 'FAQ expands');
  await screenshot('mobile-faq');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await pause(100);
  await check(`!document.documentElement.classList.contains('lenis') && getComputedStyle(document.querySelector('.editorial-cursor')).display === 'none'`, 'Reduced motion uses native scrolling and cursor');
  await check(`[...document.images].filter(image => image.getAttribute('src') && image.complete && !image.naturalWidth).length === 0`, 'No broken loaded images');
  await evaluate(`Storage.prototype.setItem = function(){ throw new DOMException('Blocked test storage','SecurityError') }; document.querySelector('[data-favorite="robe-fluide"]').click()`);
  await click('#mobile-nav .nav-selection');
  await check(`document.getElementById('selection-count').textContent === '1' && document.querySelector('.storage-note').textContent.includes('Stockage indisponible')`, 'Storage failure preserves favorites in memory');
  await escape();
  await click('.quick-view-button');
  await evaluate(`document.querySelector('.quick-gallery img').src = '/intentional-missing-qa-image.jpg'`);
  await pause(500);
  await check(`!!document.querySelector('.quick-gallery .image-load-error')`, 'Failed image has a readable error');
  await evaluate(`document.querySelector('.quick-gallery img').src = inspirations[0].src`);
  await pause(800);
  await check(`!document.querySelector('.quick-gallery .image-load-error') && document.querySelector('.quick-gallery img').naturalWidth > 0`, 'Responsive image recovers after failure');
  await escape();
  if (errors.length) throw new Error(`JavaScript exceptions: ${errors.join(', ')}`);
  console.log('PASS No JavaScript exceptions');
  console.log(`Screenshots: ${screenshots}`);
} finally { ws.close(); }
