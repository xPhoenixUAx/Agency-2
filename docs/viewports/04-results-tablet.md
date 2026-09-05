# Case Studies: tablet / 834px

Основна специфікація: ../pages/04-results.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/04-results-tablet.png.

## Послідовна реалізація

1. **Case Studies** — Centered heading, notice, без великого бокового арту.
2. **Filter case studies** — Wrap при нестачі ширини, left aligned.
3. **Scaling a product portfolio with clearer profit signals.** — Copy, illustration, narrative підряд; metrics3 вряд наприкінці.
4. **Turning enquiries into qualified opportunities.** — Одна card: intro над narrative, art компактний справа тільки якщо не стискає текст.
5. **Connecting demo requests to pipeline.** — Як попередня case card.
6. **How we read performance.** — Intro зверху,3 compact cards вряд.
7. **Want a clearer view of your account?** — Text+CTA horizontal якщо поміщається.

## Контрольні параметри

Контейнер100%, gutters32, gap20, section64, H1 48/54, body17/27. Header72: logo+audit+menu. Breakpoint768–1199. Не показувати повну desktop navigation. Мінімум input/CTA48.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
