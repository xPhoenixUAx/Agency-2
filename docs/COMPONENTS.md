# Спільні компоненти та поведінка

## Header / навігація

`header.site-header > .container > a.brand + nav + .header-actions`.
Desktop: brand, Services, How we work, Results, About, CTA. Services відкриває невелике
меню з Google Ads Management і Tracking & Automation; button з aria-expanded/aria-controls.
Посилання доступні кліком і клавіатурою, не лише hover. Escape закриває меню.
Tablet: brand, компактний CTA, menu button. Mobile: brand і menu button; CTA всередині меню.

Повноекранне меню — native dialog, showModal(), фон білий, великі вертикальні посилання,
дві служби, CTA, текст Independent Google Ads performance agency.
Close button доступний завжди; Escape і клік по backdrop закривають; клік по самому меню ні.
Після закриття фокус повертається до opener, фон заблокований від скролу; dialog scrollable.
При переході на desktop закрити dialog та відновити scroll. Врахувати 100dvh і safe-area.
При переході за якірним посиланням спочатку закрити меню.

Header sticky top:0, z-index:50. Білий/напівпрозорий фон, border-bottom після 8px прокрутки.
Не покладатись на blur для читабельності. Не зменшувати height стрибком під час scroll.

## Кнопки

Primary 48px мінімум, padding 12px 24px, radius12. Secondary біла з рамкою.
`a` для переходу; `button` для дії. Іконки стрілок декоративні.
На mobile головний CTA full width. Не дублювати три однакові CTA в межах одного екрана.
Disabled з текстом «Sending…» доступний тільки під час фактичного запиту.

## Картки

ServiceCard: іконка, h3, опис, 2 bullets опційно, link. Усе карткою clickable тільки якщо
всередині немає додаткових контролів; інакше звичайне окреме посилання.
OutcomeCard: іконка результату, h3, користь без обіцянки гарантованого результату.
CaseCard: category, видима позначка illustrative, h2/h3, Challenge/Strategy/Result,
метрики лише з контекстом. Значення metrics в HTML як текст, не частина PNG.

## Process

Семантичний ol/li, порядок незмінний. Desktop 5 колонок. Tablet для головної 3+2;
для детальних сервісів вертикальні рядки. Mobile всі кроки вертикальні.
Стрілки декор, прибираються між перенесеними рядами. Колір не є єдиним способом нумерації.

## FAQ

Native details/summary. Перший відкритий на головній та аналітиці; інші закриті.
Усі можуть відкриватися незалежно. Summary має min-height44, padding-right:32,
іконка chevron окремим SVG. Не вкладати button у summary. Відповіді існують у DOM без JS.

## Results filters

Це фільтри, не вкладки ARIA. Кнопки aria-pressed, category у data-category.
Натискання встановлює hidden на невідповідних статтях; role=status оголошує кількість.
Фокус залишається на кнопці. All показує всі. При відключених demo cases показати
пояснення «Approved case studies will be added here», сховати пусті фільтри, лишити CTA.
На mobile фільтри wrap у два рядки; горизонтальний скрол усієї сторінки заборонений.
Кейси розгортаються на цій же сторінці через details; окрема detail-page не потрібна.

## Footer

Назва, поточний рік, footer text та email із config. Google Ads/Tracking/Results/Audit +
Privacy/Terms. Desktop два ряди, tablet 2 колонки, mobile вертикальні групи.
Не копіювати випадкові посилання, роки чи підписи з картинок.

## Стан без JS та помилки

Контент і FAQ працюють без JS. У HTML залишити читабельний fallback бренду.
Якщо config не завантажується — видно повідомлення; форму заблоковано, не надсилати
на fallback адресу. Показати noscript із контактною альтернативою.
Сайт не підключає рекламні чи аналітичні скрипти за замовчуванням.
