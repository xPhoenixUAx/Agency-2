import { configReady, validateConfig, applyBrand } from './brand.js';
const editor = document.querySelector('#brand-editor');
const status = document.querySelector('#editor-status');
let source;
const labels = {
  brand: {
    name: 'Назва бренду',
    legalName: 'Юридична назва',
    description: 'Короткий опис',
    logo: 'Шлях до логотипа (можна залишити порожнім)',
    email: 'Контактна пошта / отримувач заявок',
    address: 'Адреса',
    website: 'Адреса сайту',
  },
  colors: {
    primary: 'Кнопки й посилання',
    blue: 'Синій акцент',
    red: 'Червоний акцент',
    yellow: 'Жовтий акцент',
    green: 'Зелений акцент',
    ink: 'Основний текст',
    muted: 'Другорядний текст',
    surface: 'Світлий фон секцій',
  },
  content: {
    heroTitle: 'Заголовок головної',
    heroDescription: 'Опис головної',
    cta: 'Текст основної кнопки',
    submit: 'Кнопка надсилання',
    success: 'Повідомлення після успішного надсилання',
    footer: 'Текст у футері',
  },
  links: { audit: 'Сторінка аудиту', privacy: 'Політика приватності', terms: 'Умови використання' },
  form: { businessTypes: 'Типи бізнесу', budgets: 'Рекламні бюджети', needs: 'Потрібна допомога' },
};
const containers = {
  brand: 'company-fields',
  colors: 'color-fields',
  content: 'text-fields',
  links: 'link-fields',
  form: 'option-fields',
};
labels.content.trackingCta = 'Кнопка перевірки аналітики';
function render(c) {
  source = structuredClone(c);
  for (const [group, fields] of Object.entries(labels)) {
    const container = document.getElementById(containers[group]);
    container.replaceChildren();
    for (const [key, label] of Object.entries(fields)) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field';
      const l = document.createElement('label');
      l.htmlFor = `${group}-${key}`;
      l.textContent = label;
      const field = document.createElement(
        group === 'form' || ['heroDescription', 'success', 'footer'].includes(key)
          ? 'textarea'
          : 'input',
      );
      field.id = l.htmlFor;
      field.name = `${group}.${key}`;
      field.value = Array.isArray(c[group][key]) ? c[group][key].join('\n') : c[group][key];
      if (field.tagName === 'INPUT')
        field.type = group === 'colors' ? 'color' : key === 'email' ? 'email' : 'text';
      field.required = !(group === 'brand' && key === 'logo');
      wrapper.append(l, field);
      container.append(wrapper);
    }
  }
  document.querySelector('#show-cases').checked = c.features.showIllustrativeCases;
  document.querySelector('#animations').checked = c.features.animations;
  editor.querySelector('button').disabled = false;
  applyBrand(c);
}
configReady.then(render).catch(() => {
  status.textContent =
    'Не вдалося відкрити конфіг. Запустіть редактор через локальний сервер або імпортуйте site.json.';
});
document.querySelector('#import-config').addEventListener('change', async (e) => {
  try {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 100000) throw new Error('Файл завеликий.');
    render(validateConfig(JSON.parse(await f.text())));
    status.textContent = 'Конфіг завантажено.';
  } catch (error) {
    status.textContent = `Помилка: ${error.message}`;
  }
});
editor.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!source || !editor.reportValidity()) return;
  try {
    const next = structuredClone(source);
    for (const [group, fields] of Object.entries(labels))
      for (const key of Object.keys(fields)) {
        const value = document.getElementById(`${group}-${key}`).value.trim();
        next[group][key] =
          group === 'form'
            ? value
                .split('\n')
                .map((v) => v.trim())
                .filter(Boolean)
            : value;
      }
    next.features.showIllustrativeCases = document.querySelector('#show-cases').checked;
    next.features.animations = document.querySelector('#animations').checked;
    validateConfig(next);
    applyBrand(next);
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(next, null, 2) + '\n'], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Готово. Замініть config/site.json на сайті завантаженим файлом.';
  } catch (error) {
    status.textContent = `Перевірте поля: ${error.message}`;
  }
});
