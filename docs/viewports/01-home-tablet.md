# Home: tablet / 834px

Основна специфікація: ../pages/01-home.md. Спільні токени: ../DESIGN-SYSTEM.md.

Референс: ../../references/01-home-tablet.png.

## Послідовна реалізація

1. **Hero** — Текст центрований; сцена після CTA, search окремим рядом, 4 маленькі картки2×2; height auto.
2. **The right Google Ads mix for your goals.** — Заголовок зверху; картки2×2; іконка64.
3. **Better signals. Smarter decisions.** — Текст над схемою; 3 steps горизонтально, короткі підписи.
4. **A clear process, from audit to growth.** — ol3+2, вирівняти останній ряд по лівому краю; без діагональних стрілок.
5. **Built around your business.** — Опис зверху, 4 compact tiles2×2.
6. **Frequently asked questions.** — Одна колонка, summary min-height48.
7. **Ready for a clearer growth plan?** — Текст і кнопка вряд якщо поміщаються; інакше стовпчик.

## Контрольні параметри

Контейнер100%, gutters32, gap20, section64, H1 48/54, body17/27. Header72: logo+audit+menu. Breakpoint768–1199. Не показувати повну desktop navigation. Мінімум input/CTA48.

## Перевірка

- Висота контенту автоматична; немає обрізання description або поля textarea.
- Порядок DOM відповідає порядку читання.
- Декор не перекриває контролів та тексту.
- FAQ відповіді розгортаються без стрибка header.
- Ребрендинг довгою назвою не створює horizontal scroll.
