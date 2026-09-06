import { enterElement, isMotionAllowed } from './motion.js';

export function initCookieBanner() {
  const preferences = window.signalCookiePreferences;
  if (!preferences || document.querySelector('#cookie-banner')) return;
  const banner = document.createElement('aside');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.hidden = true;
  banner.setAttribute('aria-labelledby', 'cookie-banner-title');
  banner.innerHTML = `
    <p class="cookie-eyebrow">Your privacy</p>
    <h2 id="cookie-banner-title">Cookies, on your terms.</h2>
    <p>Essential cookies keep our form secure. Optional navigation storage helps smooth
      transitions between pages. We use no advertising or analytics trackers.</p>
    <a class="cookie-policy-link" href="cookies.html">Read our Cookie Policy</a>
    <div class="cookie-actions">
      <button type="button" class="button secondary" data-cookie-choice="essential">Essential only</button>
      <button type="button" class="button secondary" data-cookie-choice="all">Allow all</button>
    </div>
    <button type="button" class="cookie-text-button" data-cookie-settings>Choose settings</button>`;
  const modal = document.createElement('dialog');
  modal.id = 'cookie-settings';
  modal.className = 'cookie-settings';
  modal.setAttribute('aria-labelledby', 'cookie-settings-title');
  modal.innerHTML = `
    <div class="cookie-modal-header">
      <div><p class="cookie-eyebrow">Privacy preferences</p><h2 id="cookie-settings-title">Cookie settings</h2></div>
      <button type="button" class="cookie-close" aria-label="Close cookie settings" autofocus>×</button>
    </div>
    <p>Choose which storage this website can use. You can change your choice at any time.</p>
    <div class="cookie-category">
      <div class="cookie-category-heading"><h3>Essential</h3><span class="cookie-required">Always on</span></div>
      <p>Protects the audit form and remembers your privacy choice. These functions are needed
        to provide the service and honour your settings.</p>
    </div>
    <div class="cookie-category">
      <label class="cookie-category-heading" for="cookie-navigation">
        <span>Navigation preferences</span>
        <input id="cookie-navigation" type="checkbox" role="switch" aria-describedby="cookie-navigation-description" />
      </label>
      <p id="cookie-navigation-description">Temporarily remembers your destination for smoother
        transitions between pages and sections. Links still work when this is off.</p>
    </div>
    <p class="cookie-tracking-note">Advertising and analytics tracking are not installed.</p>
    <a class="cookie-policy-link" href="cookies.html">Read our Cookie Policy</a>
    <div class="cookie-actions">
      <button type="button" class="button secondary" data-cookie-choice="essential">Essential only</button>
      <button type="button" class="button secondary" data-cookie-choice="all">Allow all</button>
      <button type="button" class="button" data-cookie-save>Save my settings</button>
    </div>`;
  const status = document.createElement('p');
  status.className = 'cookie-save-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(banner, modal, status);
  let returnFocus;
  let statusTimer;
  const toggle = modal.querySelector('#cookie-navigation');
  const footerSettings = document.querySelector('footer [data-cookie-settings]');
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      returnFocus = button;
      toggle.checked = preferences.get()?.navigation === true;
      modal.showModal();
      document.body.classList.add('cookie-settings-open');
      if (isMotionAllowed()) enterElement(modal, { distance: 12, duration: 420 });
    });
  });
  function close() {
    modal.close();
  }
  modal.querySelector('.cookie-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target !== modal) return;
    const rect = modal.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('cookie-settings-open');
    if (returnFocus?.getClientRects().length) returnFocus.focus({ preventScroll: true });
  });
  modal.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...modal.querySelectorAll('button, input, a[href]')].filter(
      (element) => !element.disabled && element.getClientRects().length,
    );
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  function update() {
    const choice = preferences.get();
    const wasHidden = banner.hidden;
    banner.hidden = Boolean(choice);
    if (modal.open) toggle.checked = choice?.navigation === true;
    if (!choice && wasHidden && isMotionAllowed())
      enterElement(banner, { distance: 16, duration: 600 });
  }
  function save(navigation) {
    const focusWasInside =
      banner.contains(document.activeElement) || modal.contains(document.activeElement);
    const persisted = preferences.save(navigation);
    if (modal.open) {
      if (returnFocus && banner.contains(returnFocus)) returnFocus = footerSettings;
      close();
    } else if (focusWasInside) footerSettings?.focus({ preventScroll: true });
    clearTimeout(statusTimer);
    status.textContent = persisted
      ? 'Cookie preferences saved.'
      : 'Your choice applies to this page. Your browser could not save it for future visits.';
    statusTimer = setTimeout(
      () => {
        status.textContent = '';
      },
      persisted ? 4000 : 10000,
    );
  }
  for (const panel of [banner, modal]) {
    panel.querySelectorAll('[data-cookie-choice]').forEach((button) => {
      button.addEventListener('click', () => save(button.dataset.cookieChoice === 'all'));
    });
  }
  modal.querySelector('[data-cookie-save]').addEventListener('click', () => save(toggle.checked));
  addEventListener('signal:cookie-preferences', update);
  update();
}
