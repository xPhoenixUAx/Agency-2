# Google Ads Management — google-ads.html

H1: **The right campaign mix. Built around your goals.**

Мета: пояснити спеціалізацію та привести до заявки на аудит.

## Референси

- ../../references/02-google-ads-desktop.png
- ../../references/02-google-ads-tablet.png
- ../../references/02-google-ads-mobile-a.png
- ../../references/02-google-ads-mobile-b.png

## HTML-структура і порядок

header → main → hero → channels → process → outcomes → faq → final-cta → footer. Один h1; заголовки секцій h2, карток h3.

## hero: Google Ads management

**Контент:** Strategic Google Ads management built around your audience, data and commercial goals.

**HTML:** `<section id="hero" class="section hero"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Breadcrumb; hero55/45, browser-art справа; CTA audit. |
| Tablet | Одна колонка: текст, CTA, illustration width100% max560. |
| Mobile | Одна колонка. Browser-art висотою220, 4 іконки всередині сцени; не поруч із heading. |

## channels: Four ways to reach your next customer.

**Контент:** Search & Performance Max; Shopping & feed strategy; Demand Gen & video; App campaigns.

**HTML:** `<section id="channels" class="section channels"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Сітка2×2 великих cards, icon80, h3, опис, bullets. |
| Tablet | 2×2, padding24; булети1 колонка. |
| Mobile | 4 cards одна колонка; іконка48, title20; bullets під описом. |

## process: From campaign setup to measurable growth.

**Контент:** Audit / Strategy / Setup & Launch / Optimize / Scale.

**HTML:** `<section id="process" class="section process"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 5 кроків горизонтально у pale-blue panel. |
| Tablet | 5 вертикальних компактних рядків: номер, заголовок, опис. |
| Mobile | 5 вертикальних рядків, опис під назвою, без link affordance якщо не клікабельні. |

## outcomes: Built around the right outcome.

**Контент:** Qualified leads and ecommerce sales require different signals.

**HTML:** `<section id="outcomes" class="section outcomes"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 2 cards із contact-check та product illustration. |
| Tablet | 2 cards, ілюстрація зверху кожної. |
| Mobile | 2 cards вертикально; не сховати контент одного бізнес-типу. |

## faq: Frequently asked questions.

**Контент:** Campaign selection / Existing account / Measuring success.

**HTML:** `<section id="faq" class="section faq"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 3 full-width details; можна поруч із outcomes тільки за достатньої ширини. |
| Tablet | Окрема секція нижче outcomes. |
| Mobile | Окрема секція, title28, readable answers. |

## final-cta: Ready to grow with Google Ads?

**Контент:** Request a review of your goals, account and measurement setup.

**HTML:** `<section id="final-cta" class="section final-cta"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Wide CTA panel із кнопкою справа. |
| Tablet | Panel: текст60%, button40%. |
| Mobile | Текст і кнопка full-width послідовно. |

## Специфіка сторінки

Cards ids: search-pmax, shopping, video, apps. Search/PMax bullets: campaign structure; audiences/assets/bidding; budget allocation/search terms. Shopping: Merchant Center diagnostics; feed segmentation/attributes; product-level profitability. Video: creative testing; remarketing; assisted outcomes. Apps: installs/engagement; in-app event validation; value-based evaluation. Кожен bullet — справжній li. Посилання Learn more всередині cards краще замінити audit CTA або details зі специфікою, щоб не вело на той самий якір без дії.

## Поведінка і стани

Header/menu, CTA, details/summary та посилання — за COMPONENTS.md.

## Приймання

1. Зіставити кожну секцію з PNG відповідного пристрою; точні правила з цієї таблиці мають пріоритет.
2. Не загубити секції між Mobile A і B. Це один безперервний HTML-документ.
3. На 360/390/834/1440 перевірити заголовки, картки, поля й відсутність horizontal overflow.
4. Усі CTA/якорі працюють; табуляція проходить логічно.
5. Перевірити інший бренд через site.json і довший заголовок.
