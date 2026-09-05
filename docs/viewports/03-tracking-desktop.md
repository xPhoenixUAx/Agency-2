# Tracking & Automation: desktop / 1440px

Основна специфікація: ../pages/03-tracking.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/03-tracking-desktop.png.

## Послідовна реалізація

1. **Tracking & automation** — Hero45/55; four-card feedback scene справа.
2. **Know what happens after the click.** — 3 cards у ряд, великі кольорові іконки.
3. **Less manual work. More useful signals.** — Pale-yellow panel; intro35%, 2×2 automation cards65%.
4. **A clear setup, step by step.** — 4 numbered cards горизонтально.
5. **Frequently asked questions.** — Ліва колонка heading35%, права details65%.
6. **Ready for clearer data?** — CTA right; link audit.html?need=tracking.

## Контрольні параметри

Контейнер1440 border-box, gutters48, gap24, section88, H1 64/69, body18/29. Header80. На1920 контейнер центрований. Не розтягувати текст на всю ширину великого монітора.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
