import { configReady } from './brand.js';
import { initAnchorNavigation } from './anchor-navigation.js';
import {
  initMotion,
  enterElement,
  animateElement,
  cancelElementMotion,
  readMotionTokens,
  isMotionAllowed,
  registerUIFinalizer,
} from './motion.js';

const header = document.querySelector('.site-header');
const serviceButton = document.querySelector('.nav-button');
const services = document.querySelector('#services-links');
const dialog = document.querySelector('#mobile-menu');
const opener = document.querySelector('.menu-toggle');

function closeServices(returnFocus = false) {
  if (!serviceButton) return;
  const wasOpen = serviceButton.getAttribute('aria-expanded') === 'true';
  serviceButton.setAttribute('aria-expanded', 'false');
  cancelElementMotion(services);
  services.hidden = true;
  if (returnFocus && wasOpen) serviceButton.focus();
}
serviceButton?.addEventListener('click', () => {
  const open = serviceButton.getAttribute('aria-expanded') !== 'true';
  serviceButton.setAttribute('aria-expanded', String(open));
  services.hidden = !open;
  cancelElementMotion(services);
  if (open) enterElement(services, { distance: -6, duration: readMotionTokens().ui });
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.services-menu') || event.target.closest('#services-links a')) {
    closeServices();
  }
});
document.addEventListener('focusin', (event) => {
  if (!event.target.closest('.services-menu')) closeServices();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeServices(true);
});

if (dialog && opener) {
  opener.hidden = false;
  const panel = dialog.querySelector('.menu-inner');
  let desired = false;
  let pending = false;
  let operation = 0;
  let savedScroll = 0;
  let returnFocus = true;
  const cancelParts = () => {
    cancelElementMotion(panel);
    dialog.querySelectorAll('nav a').forEach(cancelElementMotion);
  };
  const settleMenu = () => {
    if (!pending) return;
    pending = false;
    operation++;
    cancelParts();
    dialog.classList.remove('is-closing');
    if (!desired && dialog.open) {
      dialog.close();
      document.body.classList.remove('menu-open');
      window.scrollTo({ top: savedScroll, behavior: 'instant' });
    }
    opener.setAttribute('aria-expanded', String(desired));
  };
  registerUIFinalizer(settleMenu);
  const closeMenu = (immediate = false) => {
    if (!dialog.open) return;
    if (pending && !desired && !immediate) return;
    desired = false;
    pending = true;
    const current = ++operation;
    cancelParts();
    if (immediate || !isMotionAllowed()) {
      settleMenu();
      return;
    }
    dialog.classList.add('is-closing');
    const tokens = readMotionTokens();
    animateElement(
      panel,
      [
        { opacity: 1, translate: '0 0' },
        { opacity: 0, translate: '0 -6px' },
      ],
      { duration: tokens.close, easing: tokens.exitEase },
    ).then(() => {
      if (current === operation) settleMenu();
    });
  };
  opener.addEventListener('click', () => {
    if (dialog.open && desired) {
      closeMenu();
      return;
    }
    desired = true;
    returnFocus = true;
    pending = true;
    const current = ++operation;
    cancelParts();
    dialog.classList.remove('is-closing');
    if (!dialog.open) {
      savedScroll = scrollY;
      dialog.showModal();
    }
    document.body.classList.add('menu-open');
    opener.setAttribute('aria-expanded', 'true');
    dialog.querySelector('.menu-close').focus({ preventScroll: true });
    if (!isMotionAllowed()) {
      settleMenu();
      return;
    }
    const tokens = readMotionTokens();
    enterElement(panel, { distance: -8, duration: tokens.menu }).then(() => {
      if (current === operation) {
        pending = false;
      }
    });
    dialog.querySelectorAll('nav a').forEach((link, index) => {
      enterElement(link, {
        distance: 6,
        duration: tokens.ui,
        delay: Math.min(index * tokens.menuStep, tokens.menuCap),
      });
    });
  });
  dialog.querySelector('.menu-close').addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(
      (el) => el.getClientRects().length,
    );
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeMenu();
  });
  dialog.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      returnFocus = false;
      closeMenu(true);
    }),
  );
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    desired = false;
    pending = false;
    operation++;
    cancelParts();
    document.body.classList.remove('menu-open');
    dialog.classList.remove('is-closing');
    opener.setAttribute('aria-expanded', 'false');
    if (returnFocus && opener.getClientRects().length) opener.focus({ preventScroll: true });
  });
  const desktop = matchMedia('(min-width: 1200px)');
  desktop.addEventListener('change', () => {
    closeServices();
    if (desktop.matches) closeMenu(true);
  });
}
let headerFrame = 0;
const updateHeader = () => {
  headerFrame = 0;
  header?.classList.toggle('scrolled', scrollY > 8);
};
addEventListener(
  'scroll',
  () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
  },
  { passive: true },
);
updateHeader();
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach((link) => {
  const url = new URL(link.href);
  if (url.pathname.split('/').pop() === current && !url.hash) {
    link.setAttribute('aria-current', 'page');
  }
});

const completeAnchorNavigation = initAnchorNavigation();
configReady
  .then(initMotion)
  .catch(() => {
    document.documentElement.dataset.motion = 'off';
  })
  .then(completeAnchorNavigation);
