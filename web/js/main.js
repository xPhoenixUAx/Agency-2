import {configReady} from './brand.js';

const header = document.querySelector('.site-header');
const serviceButton = document.querySelector('.nav-button');
const services = document.querySelector('#services-links');
const dialog = document.querySelector('#mobile-menu');
const opener = document.querySelector('.menu-toggle');
function closeServices(returnFocus = false) {
  if (!serviceButton) return;
  const wasOpen = serviceButton.getAttribute('aria-expanded') === 'true';
  serviceButton.setAttribute('aria-expanded', 'false');
  services.hidden = true;
  if (returnFocus && wasOpen) serviceButton.focus();
}
serviceButton?.addEventListener('click', () => {
  const open = serviceButton.getAttribute('aria-expanded') !== 'true';
  serviceButton.setAttribute('aria-expanded', String(open));
  services.hidden = !open;
});
document.addEventListener('click', event => {
  if (!event.target.closest('.services-menu')) closeServices();
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.services-menu')) closeServices();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeServices(true);
});
if (dialog && opener) {
  opener.hidden = false;
  const closeMenu = () => {
    if (dialog.open) dialog.close();
    document.body.classList.remove('menu-open');
    opener.setAttribute('aria-expanded', 'false');
  };
  opener.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('menu-open');
    opener.setAttribute('aria-expanded', 'true');
  });
  dialog.querySelector('.menu-close').addEventListener('click', closeMenu);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeMenu(); });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  dialog.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    opener.setAttribute('aria-expanded', 'false');
    if (opener.getClientRects().length) opener.focus();
  });
  const desktop = matchMedia('(min-width:1200px)');
  desktop.addEventListener('change', () => { closeServices(); if (desktop.matches) closeMenu(); });
}
const updateHeader = () => header?.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', updateHeader, {passive:true});
updateHeader();
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
  const url = new URL(link.href);
  if (url.pathname.split('/').pop() === current && !url.hash) link.setAttribute('aria-current', 'page');
});
configReady.then(config => {
  if (!config.features.animations || matchMedia('(prefers-reduced-motion:reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold:0.05});
  document.querySelectorAll('main > section:not(.hero):not(.intro)').forEach(section => {
    if (section.getBoundingClientRect().top > innerHeight) { section.classList.add('reveal-ready'); observer.observe(section); }
  });
}).catch(() => {});
