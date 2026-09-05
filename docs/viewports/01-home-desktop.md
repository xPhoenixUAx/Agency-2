# Home: desktop / 1440px

Основна специфікація: ../pages/01-home.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/01-home-desktop.png.

## Послідовна реалізація

1. **Hero** — Текст центрований max-width850; сцена під ним висотою360; search field width560; 4 floating cards навколо.
2. **The right Google Ads mix for your goals.** — 4 рівні картки; заголовок і пояснення2 колонки; іконка80 зверху.
3. **Better signals. Smarter decisions.** — Панель surface, текст40% + схема60%; 3 steps горизонтально.
4. **A clear process, from audit to growth.** — ol5 колонок, номер48, назва, опис20–30 слів максимум.
5. **Built around your business.** — Опис40%, 4 icon cards60%; не вигадувати розмір команди/стаж.
6. **Frequently asked questions.** — Заголовок і короткий intro над3 full-width details.
7. **Ready for a clearer growth plan?** — Текст і кнопка вряд, декор праворуч.

## Контрольні параметри

Контейнер1440 border-box, gutters48, gap24, section88, H1 64/69, body18/29. Header80. На1920 контейнер центрований. Не розтягувати текст на всю ширину великого монітора.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
