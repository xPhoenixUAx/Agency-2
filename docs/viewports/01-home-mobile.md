# Home: mobile / 390px

Основна специфікація: ../pages/01-home.md. Спільні токени: ../DESIGN-SYSTEM.md.

Контроль:390 та360. Зображення mobile-a і mobile-b — верх і продовження, без другого header між ними.

## Послідовна реалізація

1. **Hero** — Heading36, CTA один під одним; search width100%; 2 компактні art tiles в один ряд. Ніякого обтікання тексту картками.
2. **The right Google Ads mix for your goals.** — 4 рядки в1 колонку; icon48 зліва, h3 і короткий опис справа, посилання після опису.
3. **Better signals. Smarter decisions.** — Текст, link, потім3 вертикальні рядки Ad click / Qualified lead / Sale; стрілки вниз.
4. **A clear process, from audit to growth.** — ol5 вертикальних рядків; номер32 ліворуч, текст праворуч.
5. **Built around your business.** — Опис зверху, 4 chips2×2; 14px labels, без дрібного додаткового тексту.
6. **Frequently asked questions.** — Одна колонка; заголовки переносяться; відповідь line-height26.
7. **Ready for a clearer growth plan?** — Текст, CTA full-width, декор під кнопкою або відсутній.

## Контрольні параметри

Gutters20, gap16, section48, H1 36/40, H2 28/34, body16/26. Header64:logo+menu. Довгі назви переносяться. Кнопки48, фокус3px. Схеми вертикальні, крім явно визначених2×2 hero tiles. Не робити двоколонковий hero.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
