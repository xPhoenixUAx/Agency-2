import { prepareScenes, sceneParts, playScene as runScene, typeSearch } from './motion-scenes.js';
import { initScrollDecor } from './scroll-decor.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 767px)');
const tablet = matchMedia('(max-width: 1199px)');
const seen = new WeakSet();
const splitScenes = new WeakSet();
const active = new Map();
const sceneRuns = new Map();
const uiFinalizers = new Set();
let config;
let lifetime;
let revealObserver;
let sceneObserver;
let typingObserver;
let typingRun;
let heroScrollRun;
let scrollDecorRun;
let tokens;
let sceneElements = [];
let revealElements = [];
let early = false;
let hasInitialized = false;

export function readMotionTokens() {
  const style = getComputedStyle(document.documentElement);
  const value = (name) => style.getPropertyValue(name).trim();
  const time = (name) => {
    const text = value(name);
    return parseFloat(text) * (text.endsWith('ms') ? 1 : 1000);
  };
  tokens = {
    feedback: time('--motion-feedback'),
    ui: time('--motion-ui'),
    enter: time('--motion-enter'),
    scene: time('--motion-scene'),
    step: time('--motion-step'),
    cap: time('--motion-cap'),
    node: time('--motion-node'),
    flowStep: time('--motion-flow-step'),
    typeLetter: time('--motion-type-letter'),
    typeSpace: time('--motion-type-space'),
    typeHold: time('--motion-type-hold'),
    typeClear: time('--motion-type-clear'),
    typeRest: time('--motion-type-rest'),
    close: time('--motion-close'),
    faqClose: time('--motion-faq-close'),
    menu: time('--motion-menu'),
    menuStep: time('--motion-menu-step'),
    menuCap: time('--motion-menu-cap'),
    late: time('--motion-late'),
    distance: parseFloat(value('--reveal-distance')),
    easing: value('--ease-standard'),
    enterEase: value('--ease-enter'),
    exitEase: value('--ease-exit'),
    mode: mobile.matches ? 'mobile' : tablet.matches ? 'tablet' : 'desktop',
    heroDelays: value('--hero-delays').split(',').map(Number),
    heroDurations: value('--hero-durations').split(',').map(Number),
  };
  return tokens;
}

export function isMotionAllowed() {
  return Boolean(
    lifetime &&
    config?.features.animations &&
    !reduced.matches &&
    !document.hidden &&
    typeof Element.prototype.animate === 'function' &&
    'IntersectionObserver' in window &&
    CSS.supports('translate', '0 1px'),
  );
}

export function cancelElementMotion(element) {
  active.get(element)?.cancel();
}

export function markRevealed(element) {
  seen.add(element);
  revealObserver?.unobserve(element);
}

/* Resolves true on completion, false on cancellation or failure; releases presentation styles. */
export function animateElement(element, frames, options = {}) {
  if (!element || !isMotionAllowed() || options.signal?.aborted) return Promise.resolve(false);
  cancelElementMotion(element);
  const { signal, ...timing } = options;
  const priorHint = element.style.willChange;
  element.style.willChange = 'transform, opacity';
  let animation;
  try {
    animation = element.animate(frames, {
      duration: tokens.ui,
      easing: tokens.easing,
      fill: 'both',
      ...timing,
    });
  } catch {
    element.style.willChange = priorHint;
    return Promise.resolve(false);
  }
  const release = () => {
    if (active.get(element) !== entry) return;
    active.delete(element);
    element.style.willChange = priorHint;
    if (!element.getAttribute('style')) element.removeAttribute('style');
  };
  const entry = {
    cancel() {
      animation.cancel();
      release();
    },
  };
  active.set(element, entry);
  const abort = () => entry.cancel();
  signal?.addEventListener('abort', abort, { once: true });
  return animation.finished
    .then(
      () => true,
      () => false,
    )
    .then((completed) => {
      signal?.removeEventListener('abort', abort);
      release();
      animation.cancel();
      return completed;
    });
}

export function enterElement(element, options = {}) {
  if (!element) return Promise.resolve();
  const { distance = tokens?.distance ?? 0, profile = 'text', direction = 1, ...timing } = options;
  const compact = tokens?.mode === 'mobile';
  const ease = tokens?.enterEase;
  let frames = [
    { opacity: 0, translate: `0 ${distance}px` },
    { opacity: 1, translate: '0 0' },
  ];
  let duration = tokens?.enter;
  let easing = ease;
  if (profile === 'card' || profile === 'art') {
    duration = profile === 'art' ? tokens?.scene : tokens?.enter;
    frames = [
      {
        opacity: 0,
        translate: `0 ${distance * 1.2}px`,
        scale: profile === 'art' ? '0.94' : '0.97',
      },
      { opacity: 1, translate: '0 0', scale: '1' },
    ];
  } else if (profile === 'tile' || profile === 'badge') {
    const badge = profile === 'badge';
    const x = compact || badge ? 0 : direction * 36;
    const angle = compact ? 0 : direction * (badge ? 8 : 3);
    duration = badge ? tokens?.node : tokens?.scene;
    easing = 'linear';
    frames = [
      {
        opacity: 0,
        translate: `${x}px ${badge ? 8 : distance}px`,
        scale: badge ? '0.72' : '0.92',
        rotate: `${angle}deg`,
        offset: 0,
        easing: ease,
      },
      {
        opacity: 1,
        translate: `0 ${badge ? 0 : -2}px`,
        scale: badge ? '1.06' : '1',
        rotate: `${compact ? 0 : -direction * 0.35}deg`,
        offset: 0.78,
        easing: 'ease-in-out',
      },
      { opacity: 1, translate: '0 0', scale: '1', rotate: '0deg', offset: 1 },
    ];
  }
  return animateElement(element, frames, { duration, easing, ...timing });
}

function revealProfile(element) {
  if (element.matches('.generated-visual')) return 'art';
  if (element.matches('.scene-tile')) return 'tile';
  if (element.matches('article, .card, li, .review-table-row')) return 'card';
  return 'text';
}

function revealTarget(element, delay = 0) {
  const profile = revealProfile(element);
  enterElement(element, { profile, delay });
  const icon = element.querySelector(':scope > .icon-shell');
  if (icon && profile === 'card') {
    enterElement(icon, { profile: 'badge', delay: delay + tokens.enter * 0.35 });
  }
}

export function registerUIFinalizer(callback) {
  uiFinalizers.add(callback);
  return () => uiFinalizers.delete(callback);
}

export function cancelAllMotion() {
  scrollDecorRun?.abort();
  scrollDecorRun = null;
  heroScrollRun?.abort();
  heroScrollRun = null;
  typingRun?.abort();
  typingRun = null;
  for (const controller of sceneRuns.values()) controller.abort();
  sceneRuns.clear();
  for (const entry of [...active.values()]) entry.cancel();
  for (const finish of [...uiFinalizers]) finish();
}

function initSideDecor() {
  if (!isMotionAllowed()) return;
  scrollDecorRun = new AbortController();
  initScrollDecor(scrollDecorRun.signal, isMotionAllowed);
}

function initHeroScroll() {
  if (!isMotionAllowed() || tablet.matches) return;
  const scene = document.querySelector('.page-home .search-scene');
  const hero = scene?.closest('.hero');
  if (!hero) return;
  const controller = new AbortController();
  heroScrollRun = controller;
  let frame = 0;
  let previousTime = 0;
  let needsMeasure = false;
  let velocity = 0;
  const targetAngle = () => {
    const progress = Math.min(
      1,
      Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight),
    );
    return progress * 360;
  };
  let target = targetAngle();
  let angle = target;
  const render = () => scene.style.setProperty('--hero-orbit', `${angle.toFixed(3)}deg`);
  const update = (time) => {
    frame = 0;
    if (!isMotionAllowed()) return;
    if (needsMeasure) {
      target = targetAngle();
      needsMeasure = false;
    }
    const elapsed = Math.min((time - previousTime) / 1000, 0.064);
    previousTime = time;
    // A critically damped spring eases both acceleration and settling without a bounce.
    // Time-based integration keeps the same feel on 60 Hz and high-refresh displays.
    const response = 5.5;
    const offset = angle - target;
    const impulse = velocity + response * offset;
    const decay = Math.exp(-response * elapsed);
    angle = target + (offset + impulse * elapsed) * decay;
    velocity = (velocity - response * impulse * elapsed) * decay;
    if (Math.abs(angle - target) < 0.02 && Math.abs(velocity) < 0.05) {
      angle = target;
      velocity = 0;
      render();
      return;
    }
    render();
    frame = requestAnimationFrame(update);
  };
  const schedule = () => {
    needsMeasure = true;
    if (!frame) {
      previousTime = performance.now();
      frame = requestAnimationFrame(update);
    }
  };
  const options = { passive: true, signal: controller.signal };
  window.addEventListener('scroll', schedule, options);
  window.addEventListener('resize', schedule, options);
  const observer = new ResizeObserver(schedule);
  observer.observe(hero);
  controller.signal.addEventListener(
    'abort',
    () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.style.removeProperty('--hero-orbit');
    },
    { once: true },
  );
  render();
}

function initTyping() {
  typingObserver?.disconnect();
  if (!isMotionAllowed()) return;
  const bar = document.querySelector('.search-bar');
  if (!bar) return;
  let delay = early ? tokens.heroDelays[3] + tokens.heroDurations[3] * 0.65 : tokens.ui;
  typingObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
        typingRun?.abort();
        typingRun = null;
        return;
      }
      if (typingRun || !isMotionAllowed()) return;
      const controller = new AbortController();
      typingRun = controller;
      typeSearch(
        bar,
        controller.signal,
        {
          tokens: () => tokens,
          animate: animateElement,
          allowed: isMotionAllowed,
        },
        delay,
      )
        .catch(() => controller.abort())
        .finally(() => {
          if (typingRun === controller) typingRun = null;
        });
      delay = tokens.ui;
    },
    { threshold: [0, 0.5] },
  );
  typingObserver.observe(bar);
}

function visible(element) {
  return Boolean(element.getClientRects().length && !element.closest('[hidden]'));
}
function inViewport(element, margin = 0) {
  if (!visible(element)) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 && rect.top < innerHeight + margin && rect.right > 0 && rect.left < innerWidth
  );
}
function fullyVisible(element) {
  const rect = element.getBoundingClientRect();
  return visible(element) && rect.top >= 0 && rect.bottom <= innerHeight;
}

function prepareTargets(root) {
  sceneElements = prepareScenes(root);
  const selectors = [
    '.section-heading',
    'main article',
    '.process-list > li',
    '.audiences > li',
    '.service-handover li',
    '.partnership-grid > *',
    '.review-table-row',
    '.service-story-copy > h2',
    '.service-story-copy > p:not(.eyebrow)',
    '.service-story-points',
    '.generated-visual',
    '.faq-items > details',
    '.home-management-copy',
    '.home-about-copy',
    '.audit-preview-copy',
  ];
  const candidates = [...root.querySelectorAll(selectors.join(','))].filter(
    (el) => !el.closest('[data-scene], #hero, #intro, form, .legal-copy'),
  );
  const candidateSet = new Set(candidates);
  revealElements = candidates.filter((el) => {
    for (let parent = el.parentElement; parent; parent = parent.parentElement) {
      if (candidateSet.has(parent)) return false;
    }
    return true;
  });
  revealElements.push(...root.querySelectorAll('#hero .generated-visual'));
  revealElements.forEach((el) => {
    el.dataset.reveal = '';
    el.parentElement.dataset.revealGroup = '';
  });
  root.querySelectorAll('article, .card').forEach((el) => {
    if (el.querySelector('a[href], button')) el.classList.add('card--interactive');
  });
  sceneElements.forEach((el) =>
    sceneParts(el.dataset.scene, el).forEach((part) => {
      part.dataset.motionPart = '';
    }),
  );
}

function observeReveal(element, skipCurrent = true) {
  if (seen.has(element) || !visible(element)) return;
  if (skipCurrent && element.getBoundingClientRect().top < innerHeight) {
    seen.add(element);
    return;
  }
  revealObserver?.observe(element);
}

export function initReveals() {
  revealObserver?.disconnect();
  if (!isMotionAllowed()) return;
  revealObserver = new IntersectionObserver(
    (entries) => {
      const groups = new Map();
      let count = 0;
      entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top ||
            a.boundingClientRect.left - b.boundingClientRect.left,
        )
        .forEach(({ target, boundingClientRect }) => {
          revealObserver.unobserve(target);
          if (seen.has(target) || !visible(target)) return;
          seen.add(target);
          if (!isMotionAllowed() || count++ >= 6) return;
          const group = target.parentElement;
          const row = groups.get(group);
          const index =
            row && Math.abs(row.top - boundingClientRect.top) < tokens.distance * 2 ? row.index : 0;
          groups.set(group, { top: boundingClientRect.top, index: index + 1 });
          revealTarget(target, Math.min(index * tokens.step, tokens.cap));
        });
    },
    { threshold: 0, rootMargin: '0px 0px -32px 0px' },
  );
  revealElements.forEach((el) => {
    if (early && el.closest('#hero') && inViewport(el)) return;
    observeReveal(el);
  });
}

export function playScene(name, element, signal) {
  return runScene(name, element, signal, {
    tokens: () => tokens,
    visible,
    enter: enterElement,
    animate: animateElement,
  });
}

function startScene(element, name = element.dataset.scene) {
  seen.add(element);
  sceneParts(name, element).forEach((part) => seen.add(part));
  const controller = new AbortController();
  sceneRuns.set(element, controller);
  playScene(name, element, controller.signal)
    .catch(() => {
      controller.abort();
    })
    .finally(() => {
      if (sceneRuns.get(element) === controller) sceneRuns.delete(element);
      sceneObserver?.unobserve(element);
    });
}

export function initScenes() {
  sceneObserver?.disconnect();
  if (!isMotionAllowed()) return;
  sceneObserver = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting, intersectionRatio } of entries) {
        if (!isIntersecting) {
          sceneRuns.get(target)?.abort();
          continue;
        }
        if (seen.has(target) || !isMotionAllowed()) continue;
        const split =
          splitScenes.has(target) ||
          target.getBoundingClientRect().height > innerHeight ||
          tokens.mode === 'mobile';
        if (split) {
          splitScenes.add(target);
          seen.add(target);
          sceneParts(target.dataset.scene, target).forEach((part) => observeReveal(part, false));
          sceneObserver.unobserve(target);
        } else if (intersectionRatio >= 0.18) startScene(target);
      }
    },
    { threshold: [0, 0.18, 1] },
  );
  for (const element of sceneElements) {
    if (visible(element) && element.getBoundingClientRect().bottom <= 0) {
      seen.add(element);
      sceneParts(element.dataset.scene, element).forEach((part) => seen.add(part));
      continue;
    }
    if (splitScenes.has(element)) {
      sceneParts(element.dataset.scene, element).forEach((part) => observeReveal(part));
      continue;
    }
    if (seen.has(element)) continue;
    if (inViewport(element)) {
      if (early && element.closest('#hero')) {
        if (fullyVisible(element)) {
          element.dataset.motionIntro = '';
          startScene(element);
          sceneObserver.observe(element);
        } else {
          splitScenes.add(element);
          seen.add(element);
          sceneParts(element.dataset.scene, element).forEach((part) => observeReveal(part, false));
        }
      } else {
        splitScenes.add(element);
        seen.add(element);
        sceneParts(element.dataset.scene, element).forEach((part) => observeReveal(part));
      }
    } else sceneObserver.observe(element);
  }
}

function initHero() {
  const hero = document.querySelector('#hero, #intro');
  if (!hero || !early || !isMotionAllowed()) return;
  const h1 = hero.querySelector('h1');
  const copy = h1?.parentElement;
  const elements = [
    h1,
    copy?.querySelector(':scope > p:not(.eyebrow)'),
    copy?.querySelector('.hero-actions, .service-actions, :scope > .button'),
  ];
  elements.forEach((el, index) => {
    if (el && inViewport(el) && !seen.has(el)) {
      seen.add(el);
      enterElement(el, {
        delay: tokens.heroDelays[index],
        duration: tokens.heroDurations[index],
      });
    }
  });
  const art = hero.querySelector('.generated-visual');
  if (art && !seen.has(art)) {
    if (inViewport(art)) {
      seen.add(art);
      enterElement(art, {
        profile: 'art',
        delay: tokens.heroDelays[3],
        duration: tokens.heroDurations[3],
      });
    } else observeReveal(art);
  }
}

function initFAQ(root) {
  root.querySelectorAll('.faq details').forEach((details) => {
    const summary = details.querySelector('summary');
    if (!summary) return;
    let answer = details.querySelector('.faq-answer');
    if (!answer) {
      answer = document.createElement('div');
      answer.className = 'faq-answer';
      while (summary.nextSibling) answer.append(summary.nextSibling);
      details.append(answer);
    }
    let revision = 0;
    let desired = details.open;
    let pending = false;
    const settle = () => {
      if (!pending) return;
      revision++;
      pending = false;
      cancelElementMotion(answer);
      details.open = desired;
      answer.style.removeProperty('overflow');
      details.removeAttribute('data-motion-open');
    };
    const unregister = registerUIFinalizer(settle);
    lifetime.signal.addEventListener('abort', unregister, { once: true });
    summary.addEventListener(
      'click',
      (event) => {
        if (!isMotionAllowed()) return;
        event.preventDefault();
        const height = details.open ? answer.getBoundingClientRect().height : 0;
        const opacity = details.open ? getComputedStyle(answer).opacity : 0;
        desired = pending ? !desired : !details.open;
        const operation = ++revision;
        pending = true;
        cancelElementMotion(answer);
        details.open = true;
        details.dataset.motionOpen = String(desired);
        const naturalHeight = answer.scrollHeight;
        answer.style.overflow = 'hidden';
        animateElement(
          answer,
          [
            { height: `${height}px`, opacity },
            {
              height: `${desired ? naturalHeight : 0}px`,
              opacity: desired ? 1 : 0,
            },
          ],
          { duration: desired ? tokens.ui : tokens.faqClose },
        ).then(() => {
          if (operation === revision) settle();
        });
      },
      { signal: lifetime.signal },
    );
  });
}

function refreshPolicy() {
  cancelAllMotion();
  revealObserver?.disconnect();
  sceneObserver?.disconnect();
  typingObserver?.disconnect();
  readMotionTokens();
  document.documentElement.dataset.motion = isMotionAllowed() ? 'on' : 'off';
  if (isMotionAllowed()) {
    initReveals();
    initScenes();
    initTyping();
    initHeroScroll();
    initSideDecor();
  }
}

export function destroyMotion() {
  cancelAllMotion();
  revealObserver?.disconnect();
  sceneObserver?.disconnect();
  typingObserver?.disconnect();
  lifetime?.abort();
  lifetime = null;
  document.documentElement.dataset.motion = 'off';
}

export function initMotion(nextConfig) {
  destroyMotion();
  config = nextConfig;
  lifetime = new AbortController();
  readMotionTokens();
  const navigation = performance.getEntriesByType('navigation')[0];
  const domReady = navigation?.domContentLoadedEventStart;
  const firstPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
  const readableAt = firstPaint || domReady || performance.now();
  const fromSite = document.referrer && new URL(document.referrer).origin === location.origin;
  const pageEntry = ['native', 'fallback'].includes(window.signalPageTransition?.mode);
  const pageChange = (fromSite || pageEntry) && navigation?.type !== 'reload';
  // The page transition already reveals incoming content; avoid a second entrance on top.
  early = !hasInitialized && !pageChange && performance.now() - readableAt < tokens.late;
  hasInitialized = true;
  prepareTargets(document);
  initFAQ(document);
  document.documentElement.dataset.motion = isMotionAllowed() ? 'on' : 'off';
  initReveals();
  initHero();
  initScenes();
  initTyping();
  initHeroScroll();
  initSideDecor();
  early = false;
  const options = { signal: lifetime.signal };
  reduced.addEventListener('change', refreshPolicy, options);
  mobile.addEventListener('change', refreshPolicy, options);
  tablet.addEventListener('change', refreshPolicy, options);
  document.addEventListener('visibilitychange', refreshPolicy, options);
  window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) refreshPolicy();
    },
    options,
  );
  window.addEventListener(
    'resize',
    () => {
      for (const finish of [...uiFinalizers]) finish();
      for (const controller of sceneRuns.values()) controller.abort();
      typingRun?.abort();
      typingRun = null;
      initTyping();
    },
    options,
  );
  document.addEventListener(
    'focusin',
    (event) => {
      for (const [element, entry] of active) {
        if (element === event.target || element.contains(event.target)) entry.cancel();
      }
    },
    options,
  );
  window.addEventListener('pagehide', cancelAllMotion, options);
  const instance = lifetime;
  return () => {
    if (lifetime === instance) destroyMotion();
  };
}
