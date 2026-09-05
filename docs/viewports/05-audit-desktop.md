# Free Audit: desktop / 1440px

Основна специфікація: ../pages/05-audit.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/05-audit-desktop.png.

## Послідовна реалізація

1. **Request a free audit** — Ліва колонка42%: H1, copy,3 benefits, email. Праворуч form58%.
2. **Request your free Google Ads audit** — Form card padding32,2 колонки полів; Need/Message/Privacy/Submit full row.
3. **What happens next?** — 3 colorful cards horizontally.
4. **Before you submit** — 2 details max-width920 centered.

## Контрольні параметри

Контейнер1440 border-box, gutters48, gap24, section88, H1 64/69, body18/29. Header80. На1920 контейнер центрований. Не розтягувати текст на всю ширину великого монітора.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
