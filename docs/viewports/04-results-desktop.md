# Case Studies: desktop / 1440px

Основна специфікація: ../pages/04-results.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/04-results-desktop.png.

## Послідовна реалізація

1. **Case Studies** — Heading зліва, decorative bars справа; notice під описом.
2. **Filter case studies** — Inline buttons aria-pressed.
3. **Scaling a product portfolio with clearer profit signals.** — Feature panel: copy+art70%, metrics30%; narrative3 короткі колонки знизу.
4. **Turning enquiries into qualified opportunities.** — Широкий ряд: intro,3 narrative columns, contact art.
5. **Connecting demo requests to pipeline.** — Як попередня case card.
6. **How we read performance.** — Intro35%, cards65% у3 колонки.
7. **Want a clearer view of your account?** — Text+CTA horizontal.

## Контрольні параметри

Контейнер1440 border-box, gutters48, gap24, section88, H1 64/69, body18/29. Header80. На1920 контейнер центрований. Не розтягувати текст на всю ширину великого монітора.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
