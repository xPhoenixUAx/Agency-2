# Google Ads Management: tablet / 834px

Основна специфікація: ../pages/02-google-ads.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/02-google-ads-tablet.png.

## Послідовна реалізація

1. **Google Ads management** — Одна колонка: текст, CTA, illustration width100% max560.
2. **Four ways to reach your next customer.** — 2×2, padding24; булети1 колонка.
3. **From campaign setup to measurable growth.** — 5 вертикальних компактних рядків: номер, заголовок, опис.
4. **Built around the right outcome.** — 2 cards, ілюстрація зверху кожної.
5. **Frequently asked questions.** — Окрема секція нижче outcomes.
6. **Ready to grow with Google Ads?** — Panel: текст60%, button40%.

## Контрольні параметри

Контейнер100%, gutters32, gap20, section64, H1 48/54, body17/27. Header72: logo+audit+menu. Breakpoint768–1199. Не показувати повну desktop navigation. Мінімум input/CTA48.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
