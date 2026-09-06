// One public source of truth. Do not put passwords or mail credentials in site.json.
const configURL = new URL('../config/site.json', import.meta.url);
const safeLink = (value) => {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) return null;
  try {
    const u = new URL(value, document.baseURI);
    return ['https:', 'http:'].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
};
export function validateConfig(c) {
  if (!c || typeof c !== 'object') throw new Error('Config must be an object.');
  for (const key of ['name', 'legalName', 'email', 'address', 'website', 'description', 'logo']) {
    if (typeof c.brand?.[key] !== 'string') throw new Error(`Missing brand.${key}`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.brand.email)) throw new Error('Invalid contact email.');
  if (c.legal !== undefined) {
    if (!c.legal || typeof c.legal !== 'object' || Array.isArray(c.legal))
      throw new Error('Invalid legal settings.');
    for (const [key, value] of Object.entries(c.legal)) {
      if (typeof value !== 'string') throw new Error(`Invalid legal.${key}`);
    }
    if (c.legal.privacyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.legal.privacyEmail))
      throw new Error('Invalid privacy email.');
    if (c.legal.updatedOn) {
      const date = new Date(`${c.legal.updatedOn}T00:00:00Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(c.legal.updatedOn) ||
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== c.legal.updatedOn
      )
        throw new Error('Use a valid YYYY-MM-DD date for legal.updatedOn.');
    }
    if (c.legal.supervisoryAuthorityUrl && !safeLink(c.legal.supervisoryAuthorityUrl))
      throw new Error('Invalid supervisory authority URL.');
  }
  for (const key of ['primary', 'blue', 'red', 'yellow', 'green', 'ink', 'muted', 'surface']) {
    if (!/^#[0-9a-f]{6}$/i.test(c.colors?.[key] || '')) throw new Error(`Invalid color: ${key}`);
  }
  for (const key of ['businessTypes', 'budgets', 'needs']) {
    if (
      !Array.isArray(c.form?.[key]) ||
      !c.form[key].length ||
      c.form[key].some((x) => typeof x !== 'string' || !x.trim())
    )
      throw new Error(`Invalid form.${key}`);
  }
  for (const key of ['heroTitle', 'heroDescription', 'cta', 'submit', 'success', 'footer']) {
    if (typeof c.content?.[key] !== 'string') throw new Error(`Missing content.${key}`);
  }
  for (const key of ['audit', 'privacy', 'terms']) {
    if (typeof c.links?.[key] !== 'string' || !safeLink(c.links[key]))
      throw new Error(`Invalid link: ${key}`);
  }
  if (c.links.cookies !== undefined && !safeLink(c.links.cookies))
    throw new Error('Invalid cookies link.');
  if (
    !c.features ||
    typeof c.features.showIllustrativeCases !== 'boolean' ||
    typeof c.features.animations !== 'boolean'
  )
    throw new Error('Invalid features.');
  return c;
}
const legalFallbacks = new WeakMap();
export function applyBrand(c) {
  for (const [key, value] of Object.entries(c.colors))
    document.documentElement.style.setProperty(`--${key}`, value);
  document.querySelectorAll('[data-brand]').forEach((el) => {
    const value = c.brand[el.dataset.brand];
    if (typeof value === 'string') el.textContent = value;
  });
  document.querySelectorAll('[data-content]').forEach((el) => {
    const value = c.content[el.dataset.content];
    if (typeof value === 'string') el.textContent = value;
  });
  document.querySelectorAll('[data-title-first]').forEach((el) => {
    const first = el.dataset.titleFirst,
      second = el.dataset.titleSecond,
      accent = el.dataset.titleAccent;
    if (c.content.heroTitle === `${first} ${second}${accent}`) {
      const mark = document.createElement('span');
      mark.className = 'accent';
      mark.textContent = accent;
      el.replaceChildren(
        document.createTextNode(first + ' '),
        document.createElement('br'),
        document.createTextNode(second),
        mark,
      );
    }
  });
  document.querySelectorAll('[data-link]').forEach((el) => {
    const href = safeLink(c.links[el.dataset.link]);
    if (href) {
      const url = new URL(href);
      if (el.dataset.linkFragment) url.hash = el.dataset.linkFragment;
      el.href = url.href;
    }
  });
  document.querySelectorAll('[data-tracking-link]').forEach((el) => {
    const href = safeLink(c.links.audit);
    if (href) {
      const url = new URL(href);
      url.searchParams.set('need', 'tracking');
      el.href = url.href;
    }
  });
  document.querySelectorAll('[data-email]').forEach((el) => {
    el.textContent = c.brand.email;
    el.href = `mailto:${c.brand.email}`;
  });
  document.querySelectorAll('[data-legal]').forEach((el) => {
    if (!legalFallbacks.has(el))
      legalFallbacks.set(el, { text: el.textContent, dateTime: el.getAttribute('datetime') });
    const value = c.legal?.[el.dataset.legal]?.trim();
    const fallback = legalFallbacks.get(el);
    el.textContent = value || fallback.text;
    if (el.dataset.legal === 'updatedOn' && !value && fallback.dateTime)
      el.dateTime = fallback.dateTime;
    if (el.dataset.legal === 'updatedOn' && value) {
      el.dateTime = value;
      el.textContent = new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${value}T00:00:00Z`));
    }
  });
  document.querySelectorAll('[data-legal-optional]').forEach((el) => {
    el.hidden = !c.legal?.[el.dataset.legalOptional]?.trim();
  });
  document.querySelectorAll('[data-privacy-email]').forEach((el) => {
    const email = c.legal?.privacyEmail || c.brand.email;
    el.textContent = email;
    el.href = `mailto:${email}`;
  });
  document.querySelectorAll('[data-business-website]').forEach((el) => {
    const href = safeLink(c.brand.website);
    el.textContent = c.brand.website;
    if (href) el.href = href;
    else el.removeAttribute('href');
  });
  document.querySelectorAll('[data-authority-link]').forEach((el) => {
    const href = safeLink(c.legal?.supervisoryAuthorityUrl);
    el.hidden = !href;
    if (href) el.href = href;
    else el.removeAttribute('href');
  });
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
  document.querySelectorAll('[data-logo]').forEach((el) => {
    const url = c.brand.logo && safeLink(c.brand.logo);
    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = c.brand.name;
      img.addEventListener(
        'error',
        () => {
          el.textContent = c.brand.name;
        },
        { once: true },
      );
      el.replaceChildren(img);
    }
  });
  document.querySelectorAll('select[data-options]').forEach((el) => {
    const options = c.form[el.dataset.options];
    el.replaceChildren(new Option(el.dataset.placeholder || 'Select an option', ''));
    options.forEach((value) => el.add(new Option(value, value)));
  });
  document.querySelectorAll('[data-illustrative]').forEach((el) => {
    el.hidden = !c.features.showIllustrativeCases;
  });
  document.documentElement.dataset.animations = c.features.animations ? 'on' : 'off';
  const suffix = document.documentElement.dataset.pageTitle;
  if (suffix) document.title = `${suffix} | ${c.brand.name}`;
}
export const configReady = fetch(configURL, { cache: 'no-cache' })
  .then((response) => {
    if (!response.ok) throw new Error('Cannot load site.json');
    return response.json();
  })
  .then(validateConfig)
  .then((c) => {
    applyBrand(c);
    return c;
  });
configReady.catch(() => {
  document.querySelectorAll('[data-config-error]').forEach((el) => {
    el.hidden = false;
  });
});
