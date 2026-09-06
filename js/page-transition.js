/* Runs before the first paint so native and fallback transitions share one lifecycle. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'signal:page-transition';
  let intent = null;
  try {
    const canStoreNavigation = window.signalCookiePreferences?.allowsNavigationStorage();
    const saved = canStoreNavigation ? JSON.parse(sessionStorage.getItem(key)) : null;
    if (canStoreNavigation) sessionStorage.removeItem(key);
    if (saved && Number.isFinite(saved.created) && Date.now() - saved.created < 60000) {
      const target = new URL(saved.href);
      const path = (value) => value.replace(/\/index\.html$/, '/');
      if (
        target.origin === location.origin &&
        path(target.pathname) === path(location.pathname) &&
        target.search === location.search
      ) {
        intent = saved;
      }
    }
  } catch {
    /* A native link remains usable without session storage. */
  }

  const navigation = performance.getEntriesByType('navigation')[0];
  const internal =
    navigation?.type !== 'reload' &&
    Boolean(
      intent ||
      (document.referrer && new URL(document.referrer).origin === location.origin) ||
      navigation?.type === 'back_forward',
    );
  const state = (window.signalPageTransition = { mode: 'none', finished: Promise.resolve() });
  let shown = false;
  let leaving = false;
  let generation = 0;
  let nativeTransition;
  let animations = [];
  const allowed = () =>
    !reduced.matches &&
    (root.dataset.animations ? root.dataset.animations === 'on' : intent?.motion !== false);
  const cancelFallback = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };

  async function fallback(run, incoming) {
    if (run !== generation || leaving) return;
    if (!incoming || !allowed() || !Element.prototype.animate) {
      state.mode = 'none';
      return;
    }
    state.mode = 'fallback';
    const style = getComputedStyle(root);
    const duration = parseFloat(style.getPropertyValue('--motion-page')) || 640;
    const easing = style.getPropertyValue('--ease-enter').trim() || 'ease-out';
    const owned = [];
    try {
      for (const element of document.querySelectorAll('main, body > footer')) {
        owned.push(
          element.animate(
            [
              { opacity: 0, translate: '0 12px' },
              { opacity: 1, translate: '0 0' },
            ],
            { duration, easing, fill: 'both' },
          ),
        );
      }
      animations = owned;
      await Promise.allSettled(owned.map((animation) => animation.finished));
    } finally {
      owned.forEach((animation) => animation.cancel());
      if (animations === owned) animations = [];
    }
  }

  function reveal(event) {
    const incoming = internal || shown;
    shown = true;
    leaving = false;
    const run = ++generation;
    cancelFallback();
    nativeTransition = event?.viewTransition;
    if (!nativeTransition) {
      state.finished = fallback(run, incoming).catch(() => {});
      return;
    }
    const transition = nativeTransition;
    transition.finished.catch(() => {});
    if (!allowed()) transition.skipTransition();
    state.mode = allowed() ? 'native' : 'none';
    state.finished = transition.ready
      .then(() => transition.finished)
      .catch(() => fallback(run, incoming))
      .catch(() => {});
  }

  if ('onpagereveal' in window) {
    addEventListener('pagereveal', reveal);
  } else {
    document.addEventListener('DOMContentLoaded', () => reveal(), { once: true });
    addEventListener('pageshow', (event) => {
      if (event.persisted) reveal();
    });
  }
  const leavingPage = () => {
    leaving = true;
    generation++;
    cancelFallback();
  };
  addEventListener('pageswap', (event) => {
    leavingPage();
    if (event.viewTransition) {
      event.viewTransition.ready.catch(() => {});
      event.viewTransition.finished.catch(() => {});
      if (!allowed()) event.viewTransition.skipTransition();
    }
  });
  addEventListener('pagehide', leavingPage);
  const applyPolicy = () => {
    if (!allowed()) {
      cancelFallback();
      nativeTransition?.skipTransition();
    }
  };
  reduced.addEventListener('change', applyPolicy);
  new MutationObserver(applyPolicy).observe(root, {
    attributes: true,
    attributeFilter: ['data-animations'],
  });
})();
