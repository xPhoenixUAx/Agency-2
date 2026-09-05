# Tracking & Automation: tablet / 834px

Основна специфікація: ../pages/03-tracking.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/03-tracking-tablet.png.

## Послідовна реалізація

1. **Tracking & automation** — Заголовок зверху, схема на всю ширину нижче, 4 compact horizontal nodes.
2. **Know what happens after the click.** — 3 компактні горизонтальні рядки в1 колонку.
3. **Less manual work. More useful signals.** — Intro зверху, cards2×2.
4. **A clear setup, step by step.** — 4 compact rows вертикально для довгих описів.
5. **Frequently asked questions.** — Heading над full-width details.
6. **Ready for clearer data?** — Текст і кнопка вряд.

## Контрольні параметри

Контейнер100%, gutters32, gap20, section64, H1 48/54, body17/27. Header72: logo+audit+menu. Breakpoint768–1199. Не показувати повну desktop navigation. Мінімум input/CTA48.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
