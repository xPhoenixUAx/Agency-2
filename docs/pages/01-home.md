# Home — index.html

H1: **Make every search a new opportunity.**

Мета: пояснити спеціалізацію та привести до заявки на аудит.

## Референси

- ../../references/01-home-desktop.png
- ../../references/01-home-tablet.png
- ../../references/01-home-mobile-a.png
- ../../references/01-home-mobile-b.png

## HTML-структура і порядок

header → main → hero → services → measurement → process → about → faq → final-cta → footer. Один h1; заголовки секцій h2, карток h3.

## hero: Hero

**Контент:** Centered heading, supporting copy, two CTA and search illustration.

**HTML:** `<section id="hero" class="section hero"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Текст центрований max-width850; сцена під ним висотою360; search field width560; 4 floating cards навколо. |
| Tablet | Текст центрований; сцена після CTA, search окремим рядом, 4 маленькі картки2×2; height auto. |
| Mobile | Heading36, CTA один під одним; search width100%; 2 компактні art tiles в один ряд. Ніякого обтікання тексту картками. |

## services: The right Google Ads mix for your goals.

**Контент:** Search / Performance Max / Shopping / YouTube & Demand Gen.

**HTML:** `<section id="services" class="section services"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 4 рівні картки; заголовок і пояснення2 колонки; іконка80 зверху. |
| Tablet | Заголовок зверху; картки2×2; іконка64. |
| Mobile | 4 рядки в1 колонку; icon48 зліва, h3 і короткий опис справа, посилання після опису. |

## measurement: Better signals. Smarter decisions.

**Контент:** Conversion tracking and CRM feedback connect the click to business outcomes.

**HTML:** `<section id="measurement" class="section measurement"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Панель surface, текст40% + схема60%; 3 steps горизонтально. |
| Tablet | Текст над схемою; 3 steps горизонтально, короткі підписи. |
| Mobile | Текст, link, потім3 вертикальні рядки Ad click / Qualified lead / Sale; стрілки вниз. |

## process: A clear process, from audit to growth.

**Контент:** Audit / Strategy / Setup & Launch / Optimize / Scale.

**HTML:** `<section id="process" class="section process"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | ol5 колонок, номер48, назва, опис20–30 слів максимум. |
| Tablet | ol3+2, вирівняти останній ряд по лівому краю; без діагональних стрілок. |
| Mobile | ol5 вертикальних рядків; номер32 ліворуч, текст праворуч. |

## about: Built around your business.

**Контент:** SIGNAL combines Google Ads management, measurement and automation around your business goals. Audiences: Ecommerce, Lead generation, B2B & SaaS, Mobile apps.

**HTML:** `<section id="about" class="section about"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Опис40%, 4 icon cards60%; не вигадувати розмір команди/стаж. |
| Tablet | Опис зверху, 4 compact tiles2×2. |
| Mobile | Опис зверху, 4 chips2×2; 14px labels, без дрібного додаткового тексту. |

## faq: Frequently asked questions.

**Контент:** Free audit coverage / Account access / After the audit.

**HTML:** `<section id="faq" class="section faq"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Заголовок і короткий intro над3 full-width details. |
| Tablet | Одна колонка, summary min-height48. |
| Mobile | Одна колонка; заголовки переносяться; відповідь line-height26. |

## final-cta: Ready for a clearer growth plan?

**Контент:** Get a free Google Ads audit.

**HTML:** `<section id="final-cta" class="section final-cta"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Текст і кнопка вряд, декор праворуч. |
| Tablet | Текст і кнопка вряд якщо поміщаються; інакше стовпчик. |
| Mobile | Текст, CTA full-width, декор під кнопкою або відсутній. |

## Специфіка сторінки

Hero title/description підв’язати до config.content. Для кольорового останнього слова не парсити довільний HTML із JSON: увесь заголовок textContent або окремий span зі свідомо підготовленими текстовими частинами. Після ребрендингу допустимий заголовок одного кольору. About id="about", process id="process". FAQ взяти з CONTENT-AND-ROUTES. У services CTA ведуть на якірні секції google-ads.html, measurement — tracking-automation.html. App Campaigns згадати у списку доступних напрямів біля service-grid та аудиторіях, навіть якщо чотири home cards об’єднують канали.

## Поведінка і стани

Header/menu, CTA, details/summary та посилання — за COMPONENTS.md.

## Приймання

1. Зіставити кожну секцію з PNG відповідного пристрою; точні правила з цієї таблиці мають пріоритет.
2. Не загубити секції між Mobile A і B. Це один безперервний HTML-документ.
3. На 360/390/834/1440 перевірити заголовки, картки, поля й відсутність horizontal overflow.
4. Усі CTA/якорі працюють; табуляція проходить логічно.
5. Перевірити інший бренд через site.json і довший заголовок.
