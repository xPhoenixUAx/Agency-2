# Free Audit: tablet / 834px

Основна специфікація: ../pages/05-audit.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/05-audit-tablet.png.

## Послідовна реалізація

1. **Request a free audit** — Intro зверху;3 benefit chips у ряд, form нижче width100%.
2. **Request your free Google Ads audit** — Form card24,2 колонки полів, full rows як desktop.
3. **What happens next?** — 3 compact cards; якщо текст не вміщається —1 колонка.
4. **Before you submit** — 2 details full width.

## Контрольні параметри

Контейнер100%, gutters32, gap20, section64, H1 48/54, body17/27. Header72: logo+audit+menu. Breakpoint768–1199. Не показувати повну desktop navigation. Мінімум input/CTA48.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
