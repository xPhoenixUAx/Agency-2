const intentKey = 'signal:anchor-navigation';
const transitionKey = 'signal:page-transition';
const allowsNavigationMotion = () =>
  document.documentElement.dataset.animations !== 'off' &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;
const sitePages = new Set([
  'index.html',
  'google-ads.html',
  'tracking-automation.html',
  'results.html',
  'audit.html',
  'privacy.html',
  'terms.html',
]);
const pagePath = (pathname) => pathname.replace(/\/index\.html$/, '/');
const samePage = (a, b) =>
  a.origin === b.origin && pagePath(a.pathname) === pagePath(b.pathname) && a.search === b.search;

function anchorTarget(url) {
  try {
    return document.getElementById(decodeURIComponent(url.hash.slice(1)));
  } catch {
    return null;
  }
}

function scrollToTarget(target) {
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
  target.scrollIntoView({
    behavior: allowsNavigationMotion() ? 'smooth' : 'instant',
    block: 'start',
  });
}

function consumeIntent() {
  try {
    const saved = sessionStorage.getItem(intentKey);
    sessionStorage.removeItem(intentKey);
    if (!saved) return null;
    const intent = JSON.parse(saved);
    const url = new URL(intent.href);
    const navigation = performance.getEntriesByType('navigation')[0];
    if (
      navigation?.type !== 'navigate' ||
      !url.hash ||
      !samePage(url, new URL(location.href)) ||
      !Number.isFinite(intent.created) ||
      Date.now() - intent.created > 60000
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export function initAnchorNavigation() {
  const pending = consumeIntent();
  const interruption = new AbortController();
  let interrupted = false;
  if (pending) {
    for (const name of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
      window.addEventListener(
        name,
        () => {
          interrupted = true;
        },
        {
          once: true,
          passive: true,
          signal: interruption.signal,
        },
      );
    }
    window.addEventListener(
      'pagehide',
      () => {
        interrupted = true;
      },
      {
        once: true,
        signal: interruption.signal,
      },
    );
  }

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    if (!samePage(url, new URL(location.href))) {
      if (!sitePages.has(url.pathname.split('/').pop() || 'index.html')) return;
      const motion = allowsNavigationMotion();
      try {
        sessionStorage.setItem(
          transitionKey,
          JSON.stringify({ href: url.href, created: Date.now(), motion }),
        );
      } catch {
        /* The incoming page can also identify an internal referrer. */
      }
      if (!url.hash || !motion) return;
      // Load the next page at the top; a native fragment jump would precede its first paint.
      try {
        sessionStorage.setItem(intentKey, JSON.stringify({ href: url.href, created: Date.now() }));
      } catch {
        return; // Native navigation still works when storage is unavailable.
      }
      event.preventDefault();
      url.hash = '';
      location.assign(url.href);
      return;
    }
    if (!url.hash) return;
    const target = anchorTarget(url);
    if (!target || !target.getClientRects().length) return;
    event.preventDefault();
    if (url.href !== location.href) history.pushState(history.state, '', url);
    scrollToTarget(target);
  });

  return async function completeAnchorNavigation() {
    if (!pending) return;
    try {
      if (document.readyState !== 'complete') {
        await new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
      }
      await document.fonts.ready;
      // The early controller owns both native transitions and their fallback.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await window.signalPageTransition?.finished;
      if (interrupted) return;
      history.replaceState(history.state, '', pending.href);
      const target = anchorTarget(pending);
      if (target?.getClientRects().length) scrollToTarget(target);
    } finally {
      interruption.abort();
    }
  };
}
