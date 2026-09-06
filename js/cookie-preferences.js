/* Read before navigation scripts: optional storage starts off. */
(() => {
  const key = 'signal:cookie-preferences';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const navigationKeys = ['signal:anchor-navigation', 'signal:page-transition'];
  function parse(value) {
    try {
      const record = JSON.parse(value);
      const now = Date.now();
      return record?.version === 1 &&
        typeof record.navigation === 'boolean' &&
        Number.isFinite(record.savedAt) &&
        record.savedAt <= now &&
        now - record.savedAt < lifetime
        ? record
        : null;
    } catch {
      return null;
    }
  }
  function read() {
    try {
      const raw = localStorage.getItem(key);
      const record = parse(raw);
      if (raw && !record) localStorage.removeItem(key);
      return record;
    } catch {
      return null;
    }
  }
  let current = read();
  function clearNavigation() {
    for (const name of navigationKeys) {
      try {
        sessionStorage.removeItem(name);
      } catch {
        /* Public navigation also works when browser storage is unavailable. */
      }
    }
  }
  function get() {
    if (current && !parse(JSON.stringify(current))) {
      current = null;
      try {
        localStorage.removeItem(key);
      } catch {}
      clearNavigation();
    }
    return current ? { ...current } : null;
  }
  function notify() {
    if (!current?.navigation) clearNavigation();
    dispatchEvent(new CustomEvent('signal:cookie-preferences', { detail: get() }));
  }
  window.signalCookiePreferences = Object.freeze({
    get,
    allowsNavigationStorage: () => get()?.navigation === true,
    save(navigation) {
      current = { version: 1, navigation: navigation === true, savedAt: Date.now() };
      let persisted = false;
      try {
        localStorage.setItem(key, JSON.stringify(current));
        persisted = true;
      } catch {
        /* Keep the choice in memory for this page when persistence is blocked. */
      }
      notify();
      return persisted;
    },
  });
  if (!current?.navigation) clearNavigation();
  addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    current = read();
    notify();
  });
  addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    current = read();
    notify();
  });
})();
