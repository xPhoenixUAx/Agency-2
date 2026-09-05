# Google Ads Management: mobile / 390px

Основна специфікація: ../pages/02-google-ads.md. Спільні токени: ../DESIGN-SYSTEM.md.

Контроль:390 та360. Зображення mobile-a і mobile-b — верх і продовження, без другого header між ними.

## Послідовна реалізація

1. **Google Ads management** — Одна колонка. Browser-art висотою220, 4 іконки всередині сцени; не поруч із heading.
2. **Four ways to reach your next customer.** — 4 cards одна колонка; іконка48, title20; bullets під описом.
3. **From campaign setup to measurable growth.** — 5 вертикальних рядків, опис під назвою, без link affordance якщо не клікабельні.
4. **Built around the right outcome.** — 2 cards вертикально; не сховати контент одного бізнес-типу.
5. **Frequently asked questions.** — Окрема секція, title28, readable answers.
6. **Ready to grow with Google Ads?** — Текст і кнопка full-width послідовно.

## Контрольні параметри

Gutters20, gap16, section48, H1 36/40, H2 28/34, body16/26. Header64:logo+menu. Довгі назви переносяться. Кнопки48, фокус3px. Схеми вертикальні, крім явно визначених2×2 hero tiles. Не робити двоколонковий hero.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
