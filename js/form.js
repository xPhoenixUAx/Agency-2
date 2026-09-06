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
if (form) {
  const status = form.querySelector('[role=status]');
  const submit = form.querySelector('[type=submit]');
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'button secondary retry-session';
  retry.textContent = 'Retry connection';
  retry.hidden = true;
  status.after(retry);
  let csrf = '';
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
    });
    const data = await r.json();
    if (!r.ok || typeof data.csrf !== 'string') throw new Error('Session unavailable');
    csrf = data.csrf;
  }
  submit.disabled = true;
  async function connect() {
    retry.disabled = true;
    try {
      const [c] = await Promise.all([configReady, token()]);
      cfg = c;
      submit.disabled = false;
      retry.hidden = true;
      if (
        new URLSearchParams(location.search).get('need') === 'tracking' &&
        c.form.needs.includes(c.form.trackingNeed)
      )
        form.elements.need.value = c.form.trackingNeed;
      say('');
    } catch {
      say(
        'The form is unavailable. Retry the connection or use the contact email on this page.',
        'error',
      );
      retry.hidden = false;
    } finally {
      retry.disabled = false;
    }
  }
  connect();
  retry.addEventListener('click', connect);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !csrf || !cfg) return;
    form.querySelectorAll('[aria-invalid]').forEach((el) => {
      el.removeAttribute('aria-invalid');
      const ids = (el.getAttribute('aria-describedby') || '')
        .split(' ')
        .filter((id) => id && id !== `${el.id}-error`);
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
      else el.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('[data-server-error]').forEach((el) => el.remove());
    if (!form.reportValidity()) return;
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    say('Sending your request…');
    const data = new FormData(form);
    data.set('csrf', csrf);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        credentials: 'same-origin',
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        for (const [name, message] of Object.entries(result.errors || {})) {
          const field = form.elements.namedItem(name);
          if (field instanceof HTMLElement) {
            field.setAttribute('aria-invalid', 'true');
            const note = document.createElement('p');
            note.className = 'error-text';
            note.dataset.serverError = '';
            note.id = `${field.id}-error`;
            note.textContent = String(message);
            field.closest('.field')?.append(note);
            if (isMotionAllowed()) {
              enterElement(note, {
                duration: readMotionTokens().feedback,
                distance: 0,
              });
            }
            field.setAttribute(
              'aria-describedby',
              `${field.getAttribute('aria-describedby') || ''} ${note.id}`.trim(),
            );
          }
        }
        say(result.message || 'Your request could not be sent. Please try again.', 'error');
        if (response.status === 403) {
          csrf = '';
          await token();
        }
        form.querySelector('[aria-invalid=true]')?.focus();
        return;
      }
      form.reset();
      say(cfg.content.success, 'success');
      status.focus();
      // Keep the confirmed success state even if the next session fetch fails.
      try {
        await token();
      } catch {
        csrf = '';
        retry.hidden = false;
      }
    } catch {
      say('We could not confirm submission. Check your connection before trying again.', 'error');
    } finally {
      sending = false;
      submit.disabled = !csrf;
      submit.textContent = cfg.content.submit;
      retry.hidden = Boolean(csrf);
      form.removeAttribute('aria-busy');
    }
  });
}
