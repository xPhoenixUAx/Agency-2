import { configReady } from './brand.js';
import { enterElement, cancelElementMotion, readMotionTokens, markRevealed } from './motion.js';
const cards = [...document.querySelectorAll('article[data-category]')];
const filters = document.querySelector('[data-case-filters]');
const status = document.querySelector('[data-filter-status]');
const empty = document.querySelector('[data-cases-empty]');
configReady
  .then((config) => {
    const show = config.features.showIllustrativeCases;
    filters.hidden = !show;
    empty.hidden = show;
    if (!show) {
      status.textContent = 'Approved case studies will be added here.';
      return;
    }
    status.textContent = `${cards.length} illustrative case studies shown.`;
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      filters
        .querySelectorAll('button')
        .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach((card) => {
        markRevealed(card);
        cancelElementMotion(card);
        card.hidden =
          button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) enterElement(card, { distance: 6, duration: readMotionTokens().ui });
      });
      const count = cards.filter((card) => !card.hidden).length;
      status.textContent = `${count} illustrative case ${count === 1 ? 'study' : 'studies'} shown.`;
    });
  })
  .catch(() => {
    filters.hidden = true;
  });
