// One public source of truth. Do not put passwords or mail credentials in site.json.
const configURL = new URL('../config/site.json', import.meta.url);
export const siteLinks = Object.freeze({
  audit: 'audit.html',
  privacy: 'privacy.html',
  terms: 'terms.html',
  cookies: 'cookies.html',
});
const pageFiles = [
  'index.html',
  'google-ads.html',
  'tracking-automation.html',
  'results.html',
  'audit.html',
  'privacy.html',
  'terms.html',
  'cookies.html',
];
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
  if (!c || typeof c !== 'object' || Array.isArray(c)) throw new Error('Config must be an object.');
  c = structuredClone(c);
  const trim = (value) => {
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string') value[key] = value[key].trim();
      else if (value[key] && typeof value[key] === 'object') trim(value[key]);
    }
  };
  trim(c);
  for (const key of [
    'name',
    'legalName',
    'email',
    'address',
    'website',
    'description',
    'logo',
    'favicon',
  ]) {
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
    if (
      c.legal.supervisoryAuthorityUrl &&
      (!/^https?:\/\//i.test(c.legal.supervisoryAuthorityUrl) ||
        !safeLink(c.legal.supervisoryAuthorityUrl))
    )
      throw new Error('Invalid supervisory authority URL.');
  }
  for (const key of [
    'name',
    'legalName',
    'email',
    'address',
    'website',
    'description',
    'favicon',
  ]) {
    if (!c.brand[key].trim()) throw new Error('Empty brand.' + key);
  }
  for (const key of ['logo', 'favicon']) {
    if (
      c.brand[key] &&
      (!safeLink(c.brand[key]) ||
        /[\x00-\x20\\]/.test(c.brand[key]) ||
        c.brand[key].startsWith('//'))
    )
      throw new Error('Invalid brand.' + key);
  }
  let website;
  try {
    website = new URL(c.brand.website);
  } catch {
    throw new Error('Enter a full website URL.');
  }
  if (
    !['https:', 'http:'].includes(website.protocol) ||
    website.username ||
    website.password ||
    website.search ||
    website.hash
  )
    throw new Error('Website must be an HTTP(S) base URL without credentials, query or fragment.');
  for (const page of pageFiles) {
    if (typeof c.pageTitles?.[page] !== 'string' || !c.pageTitles[page].trim())
      throw new Error('Missing pageTitles.' + page);
  }
  for (const key of ['recipient', 'from', 'subject']) {
    const value = c.mail?.[key];
    if (typeof value !== 'string' || /[\r\n]/.test(value)) throw new Error('Invalid mail.' + key);
    if (key !== 'subject' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      throw new Error('Invalid mail.' + key);
  }
  if (!c.mail.subject.trim()) throw new Error('Enter an email subject.');
  for (const key of ['businessTypes', 'budgets', 'needs']) {
    if (
      !Array.isArray(c.form?.[key]) ||
      !c.form[key].length ||
      c.form[key].some(
        (x) => typeof x !== 'string' || !x.trim() || new TextEncoder().encode(x).length > 100,
      )
    )
      throw new Error(`Invalid form.${key}`);
  }
  for (const key of ['heroTitle', 'heroDescription', 'cta', 'trackingCta', 'submit', 'success']) {
    if (typeof c.content?.[key] !== 'string' || !c.content[key].trim())
      throw new Error(`Missing content.${key}`);
  }
  if (!c.form.needs.includes(c.form.trackingNeed))
    throw new Error('form.trackingNeed must match one of form.needs.');
  if (typeof c.features?.showIllustrativeCases !== 'boolean')
    throw new Error('Invalid features.showIllustrativeCases.');
  return c;
}
const legalFallbacks = new WeakMap();
export function applyBrand(c) {
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
    const href = safeLink(siteLinks[el.dataset.link]);
    if (href) {
      const url = new URL(href);
      if (el.dataset.linkFragment) url.hash = el.dataset.linkFragment;
      el.href = url.href;
    }
  });
  document.querySelectorAll('[data-tracking-link]').forEach((el) => {
    const href = safeLink(siteLinks.audit);
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
    const fallback = () => {
      const name = document.createElement('span');
      name.dataset.brand = 'name';
      name.textContent = c.brand.name;
      const dots = document.createElement('span');
      dots.className = 'brand-dots';
      dots.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 4; i++) dots.append(document.createElement('i'));
      el.replaceChildren(name, dots);
    };
    const url = c.brand.logo && safeLink(c.brand.logo);
    if (!url) {
      fallback();
      return;
    }
    const current = el.querySelector('img');
    if (current?.src === url) {
      current.alt = c.brand.name;
      if (current.complete && !current.naturalWidth) fallback();
      else
        current.addEventListener(
          'error',
          () => {
            if (el.contains(current)) fallback();
          },
          { once: true },
        );
      return;
    }
    const img = document.createElement('img');
    img.src = url;
    img.alt = c.brand.name;
    img.addEventListener(
      'error',
      () => {
        if (el.contains(img)) fallback();
      },
      { once: true },
    );
    el.replaceChildren(img);
  });
  document.querySelectorAll('[data-favicon]').forEach((el) => {
    el.href = safeLink(c.brand.favicon);
    el.removeAttribute('sizes');
    el.removeAttribute('type');
  });
  document.querySelectorAll('select[data-options]').forEach((el) => {
    const options = c.form[el.dataset.options];
    el.replaceChildren(new Option(el.dataset.placeholder || 'Select an option', ''));
    options.forEach((value) => el.add(new Option(value, value)));
  });
  document.querySelectorAll('[data-illustrative]').forEach((el) => {
    el.hidden = !c.features.showIllustrativeCases;
  });
  document.documentElement.dataset.animations = 'on';
  const page = document.documentElement.dataset.page;
  if (c.pageTitles[page]) document.title = `${c.pageTitles[page]} | ${c.brand.name}`;
}
const embeddedConfig = document.querySelector('#site-config');
export const configReady =
  location.protocol === 'file:'
    ? // Folder preview keeps the HTML defaults; PHP remains the config source on hosting.
      Promise.resolve({ features: { showIllustrativeCases: true } }).then((config) => {
        document.documentElement.dataset.animations = 'on';
        return config;
      })
    : (embeddedConfig
        ? Promise.resolve().then(() => JSON.parse(embeddedConfig.textContent))
        : fetch(configURL, { cache: 'no-cache' }).then((response) => {
            if (!response.ok) throw new Error('Cannot load site.json');
            return response.json();
          })
      )
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
