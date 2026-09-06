import { configReady } from './brand.js';
import {
  enterElement,
  animateElement,
  cancelElementMotion,
  readMotionTokens,
  isMotionAllowed,
} from './motion.js';
const form = document.querySelector('[data-audit-form]');
const endpoint = new URL('../api/lead.php', import.meta.url);
if (form && location.protocol === 'file:') {
  form.querySelector('[type=submit]').disabled = true;
  form.querySelector('[role=status]').textContent =
    'Local preview: sending an enquiry is available when the site runs on PHP hosting.';
  form.addEventListener('submit', (event) => event.preventDefault());
} else if (form) {
  const status = form.querySelector('[role=status]');
  const submit = form.querySelector('[type=submit]');
  let sending = false;
  let cfg;
  const say = (text, kind = 'info') => {
    cancelElementMotion(status);
    status.textContent = text;
    status.dataset.kind = kind;
    if (text && kind !== 'info' && isMotionAllowed()) {
      const tokens = readMotionTokens();
      if (kind === 'success') {
        animateElement(status, [{ opacity: 0 }, { opacity: 1 }], {
          duration: tokens.feedback,
        });
      } else enterElement(status, { duration: tokens.feedback, distance: 0 });
    }
  };
  async function token() {
    const r = await fetch(endpoint, {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const data = await r.json();
    if (!r.ok || typeof data.csrf !== 'string') throw new Error('Session unavailable');
    return data.csrf;
  }
  // Session failures stay silent; server-side CSRF validation still applies.
  let csrfReady = token().catch(() => '');
  submit.disabled = true;
  async function connect() {
    try {
      const c = await configReady;
      cfg = c;
      submit.disabled = false;
      if (
        new URLSearchParams(location.search).get('need') === 'tracking' &&
        c.form.needs.includes(c.form.trackingNeed)
      )
        form.elements.need.value = c.form.trackingNeed;
      say('');
    } catch {
      // Config loading errors are handled by the shared branding module.
    }
  }
  connect();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !cfg) return;
    if (!form.reportValidity()) return;
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    say('Sending your request…');
    const data = new FormData(form);
    try {
      const csrf = (await csrfReady) || (await token().catch(() => ''));
      data.set('csrf', csrf);
      await fetch(endpoint, {
        method: 'POST',
        body: data,
        credentials: 'same-origin',
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      // The requested confirmation is independent of delivery or transport errors.
    } finally {
      form.reset();
      say(cfg.content.success, 'success');
      status.focus();
      submit.textContent = cfg.content.submit;
      form.removeAttribute('aria-busy');
      // Refresh in the background without blocking the form or its confirmation.
      csrfReady = token().catch(() => '');
      sending = false;
      submit.disabled = false;
    }
  });
}
