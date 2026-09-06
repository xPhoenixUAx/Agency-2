/* Raster artwork stays intact. Only real DOM parts have independent motion. */
const pathLengths = new WeakMap();
const searchRuns = new WeakMap();
const searchPhrases = [
  'Turn searches into customers',
  'Reach more people with Google Ads',
  'Bring in more qualified leads',
  'Make every ad click count',
  'Turn better data into growth',
];
export function prepareScenes(root = document) {
  const assign = (selector, name) =>
    root.querySelectorAll(selector).forEach((el) => {
      el.dataset.scene = name;
    });
  assign('.search-scene', 'search');
  assign('#measurement .flow', 'conversion-flow');
  assign('.feedback-scene', 'tracking-loop');
  assign('.automation-grid, .home-automation-grid', 'automation');
  assign('.cta-panel', 'final-cta');
  root.querySelectorAll('[data-scene="conversion-flow"], .feedback-scene .flow').forEach((flow) => {
    flow.classList.add('motion-connectors');
    [...flow.children].slice(0, -1).forEach((node) => {
      if (node.querySelector('.motion-connector')) return;
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('motion-connector');
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', 'M3 12H21M15 6L21 12L15 18');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.6');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      svg.append(path);
      node.append(svg);
    });
  });
  const caption = root.querySelector('.feedback-caption');
  if (caption && !caption.querySelector('svg')) {
    caption.classList.add('motion-return');
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('motion-return-svg');
    svg.setAttribute('viewBox', '0 0 600 24');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M599 0V10Q599 23 586 23H14Q1 23 1 10V0');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.5');
    svg.append(path);
    caption.prepend(svg);
  }
  return [...root.querySelectorAll('[data-scene]')];
}

export function sceneParts(name, element) {
  if (name === 'search') return [...element.querySelectorAll('.search-bar, .scene-tile')];
  if (name === 'tracking-loop') return [...element.querySelectorAll('.flow > li')];
  if (name === 'conversion-flow') return [...element.children];
  if (name === 'automation') return [...element.querySelectorAll('article')];
  if (name === 'final-cta') return [...element.children];
  return [];
}

/* Change phrases only between completed cycles, never letter by letter in the DOM. */
export async function typeSearch(bar, signal, motion, delay) {
  const text = bar?.querySelector('.search-query-text');
  if (!text || signal.aborted || !motion.allowed()) return;
  let state = searchRuns.get(bar);
  if (!state) {
    state = { original: text.textContent, index: 0, run: null };
    searchRuns.set(bar, state);
  }
  state.run = signal;
  const phrases = [state.original, ...searchPhrases];
  const restore = () => {
    if (state.run !== signal) return;
    text.textContent = state.original;
    state.run = null;
  };
  signal.addEventListener('abort', restore, { once: true });
  try {
    while (!signal.aborted && motion.allowed()) {
      text.textContent = phrases[state.index];
      const completed = await typePhrase(bar, signal, motion, delay);
      if (!completed || signal.aborted) break;
      state.index = (state.index + 1) % phrases.length;
      delay = 0;
    }
  } finally {
    signal.removeEventListener('abort', restore);
    restore();
  }
}

/* Keep each complete phrase in the DOM; reveal whole glyphs without layout shifts. */
async function typePhrase(bar, signal, motion, delay) {
  const text = bar?.querySelector('.search-query-text');
  const caret = bar?.querySelector('.search-caret');
  const node = text?.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE || !caret || signal.aborted) return;

  const range = document.createRange();
  range.selectNodeContents(text);
  const width = text.getBoundingClientRect().width;
  // A translated or enlarged phrase can wrap; leave that readable as normal text.
  if (!width || range.getClientRects().length !== 1) return;
  const tokens = motion.tokens();
  const letters =
    typeof Intl.Segmenter === 'function'
      ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(node.data)].map(
          (part) => part.segment,
        )
      : Array.from(node.data);
  const points = [{ time: 0, fraction: 0 }];
  let time = 0;
  let end = 0;
  range.setStart(node, 0);
  letters.forEach((letter, index) => {
    end += letter.length;
    range.setEnd(node, end);
    time += /\s/u.test(letter) ? tokens.typeSpace : tokens.typeLetter + (index % 4) * 7;
    points.push({ time, fraction: Math.min(1, range.getBoundingClientRect().width / width) });
  });
  if (!time) return;
  points.at(-1).fraction = 1;
  const clearAt = time + tokens.typeHold;
  const clearedAt = clearAt + tokens.typeClear;
  const finish = clearedAt + tokens.typeRest;
  const reveal = points.map(({ time: at, fraction }) => ({
    clipPath: `inset(0 ${(1 - fraction) * 100}% 0 0)`,
    offset: at / finish,
    easing: 'steps(1, end)',
  }));
  reveal.push(
    { clipPath: 'inset(0 0% 0 0)', offset: clearAt / finish, easing: 'ease-in-out' },
    { clipPath: 'inset(0 100% 0 0)', offset: clearedAt / finish },
    { clipPath: 'inset(0 100% 0 0)', offset: 1 },
  );
  const cursor = points.map(({ time: at, fraction }) => ({
    translate: `${(fraction - 1) * 100}% 0`,
    opacity: 1,
    offset: at / finish,
    easing: 'steps(1, end)',
  }));
  // Read, blink twice, clear, and repeat on one shared native animation timeline.
  [320, 560, 880, 1200].forEach((pause, index) => {
    cursor.push({
      translate: '0% 0',
      opacity: index % 2,
      offset: (time + pause) / finish,
      easing: 'steps(1, end)',
    });
  });
  cursor.push(
    { translate: '0% 0', opacity: 1, offset: clearAt / finish, easing: 'ease-in-out' },
    { translate: '-100% 0', opacity: 1, offset: clearedAt / finish },
    { translate: '-100% 0', opacity: 1, offset: 1 },
  );
  const timing = { delay, duration: finish, easing: 'linear', signal };
  const completed = await Promise.all([
    motion.animate(text, reveal, timing),
    motion.animate(caret, cursor, timing),
  ]);
  return completed.every(Boolean);
}

export async function playScene(name, element, signal, motion) {
  const tokens = motion.tokens();
  const parts = sceneParts(name, element).filter(motion.visible);
  const jobs = [];
  const enter = (el, delay, duration = tokens.node, options = {}) => {
    if (!el || signal.aborted) return;
    jobs.push(motion.enter(el, { delay, duration, signal, ...options }));
  };
  const draw = (path, delay, duration = tokens.flowStep * 1.4) => {
    if (!path || signal.aborted) return;
    if (!pathLengths.has(path)) pathLengths.set(path, path.getTotalLength());
    const length = pathLengths.get(path);
    jobs.push(
      motion.animate(
        path,
        [
          { strokeDasharray: `${length}`, strokeDashoffset: length },
          { strokeDasharray: `${length}`, strokeDashoffset: 0 },
        ],
        { delay, duration, signal, easing: tokens.enterEase },
      ),
    );
  };
  if (name === 'search') {
    const selectors = [
      '.search-bar',
      '.search-query',
      '.ad-tile',
      '.product-tile',
      '.lead-tile',
      '.growth-tile',
    ];
    const origin = element.hasAttribute('data-motion-intro') ? 0 : tokens.heroDelays[3];
    selectors.forEach((selector, index) => {
      const el = element.querySelector(selector);
      if (el && motion.visible(el)) {
        if (index === 1) {
          return;
        }
        const delay = tokens.heroDelays[index + 3] - origin;
        enter(el, delay, tokens.heroDurations[index + 3], {
          profile: index < 2 ? 'text' : 'tile',
          direction: index < 4 ? 1 : -1,
          distance: index === 1 ? 0 : tokens.distance,
        });
        const icon = index > 1 ? el.querySelector('.icon-shell') : null;
        enter(icon, delay + tokens.node * 0.5, tokens.node, { profile: 'badge' });
      }
    });
    element.querySelectorAll('.scene-dot, .scene-arc').forEach((el, index) => {
      if (motion.visible(el)) {
        enter(el, tokens.heroDelays[5] - origin + index * tokens.step, tokens.scene, {
          profile: 'art',
          distance: tokens.distance * 0.5,
        });
      }
    });
  } else if (name === 'final-cta') {
    parts.forEach((el, index) => {
      const decor = el.classList.contains('cta-decor');
      enter(
        el,
        decor ? tokens.step * 2 : index * tokens.step,
        decor ? tokens.scene : tokens.enter,
        {
          profile: decor ? 'art' : 'text',
        },
      );
    });
  } else if (name === 'automation') {
    parts.forEach((el, index) => {
      const delay = Math.min(index * tokens.step, tokens.cap);
      enter(el, delay, tokens.enter, { profile: 'card' });
      enter(el.querySelector('.icon-shell'), delay + tokens.enter * 0.4, tokens.node, {
        profile: 'badge',
      });
    });
  } else {
    const interval = tokens.flowStep;
    parts.forEach((el, index) => {
      enter(el, index * interval, tokens.node, { profile: 'card' });
      enter(el.querySelector('.icon-shell'), index * interval + tokens.node * 0.4, tokens.node, {
        profile: 'badge',
      });
      draw(el.querySelector('.motion-connector path'), (index + 1) * interval);
    });
    const caption =
      name === 'tracking-loop'
        ? element.querySelector('.feedback-caption')
        : element.parentElement.querySelector('.caption');
    enter(caption, parts.length * interval, tokens.enter);
    const path = element.querySelector('.motion-return-svg path');
    draw(path, parts.length * interval, tokens.scene);
  }
  await Promise.all(jobs);
}
