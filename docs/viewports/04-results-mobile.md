# Case Studies: mobile / 390px

Основна специфікація: ../pages/04-results.md. Спільні токени: ../DESIGN-SYSTEM.md.

Контроль:390 та360. Зображення mobile-a і mobile-b — верх і продовження, без другого header між ними.

## Послідовна реалізація

1. **Case Studies** — Heading36, notice14, один маленький декоративний motif максимум.
2. **Filter case studies** — Wrap2 ряди; min-height44; не горизонтальний carousel.
3. **Scaling a product portfolio with clearer profit signals.** — Copy, small art, Challenge/Strategy/Result вертикально; metrics3 горизонтальні рядки, кожна label/value; видима illustrative позначка.
4. **Turning enquiries into qualified opportunities.** — Одна card: іконка, title,3 stacked narrative rows. Без вигаданих чисел.
5. **Connecting demo requests to pipeline.** — Як попередня case card; не видаляти третій кейс для коротшого макета.
6. **How we read performance.** — 3 compact rows, labels і один рядок опису.
7. **Want a clearer view of your account?** — Text then full-width CTA.

## Контрольні параметри

Gutters20, gap16, section48, H1 36/40, H2 28/34, body16/26. Header64:logo+menu. Довгі назви переносяться. Кнопки48, фокус3px. Схеми вертикальні, крім явно визначених2×2 hero tiles. Не робити двоколонковий hero.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
