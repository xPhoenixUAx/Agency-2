# Google Ads Management: desktop / 1440px

Основна специфікація: ../pages/02-google-ads.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/02-google-ads-desktop.png.

## Послідовна реалізація

1. **Google Ads management** — Breadcrumb; hero55/45, browser-art справа; CTA audit.
2. **Four ways to reach your next customer.** — Сітка2×2 великих cards, icon80, h3, опис, bullets.
3. **From campaign setup to measurable growth.** — 5 кроків горизонтально у pale-blue panel.
4. **Built around the right outcome.** — 2 cards із contact-check та product illustration.
5. **Frequently asked questions.** — 3 full-width details; можна поруч із outcomes тільки за достатньої ширини.
6. **Ready to grow with Google Ads?** — Wide CTA panel із кнопкою справа.

## Контрольні параметри

Контейнер1440 border-box, gutters48, gap24, section88, H1 64/69, body18/29. Header80. На1920 контейнер центрований. Не розтягувати текст на всю ширину великого монітора.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
