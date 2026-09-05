# Tracking & Automation — tracking-automation.html

H1: **Turn better data into better decisions.**

Мета: пояснити спеціалізацію та привести до заявки на аудит.

## Референси

- ../../references/03-tracking-desktop.png
- ../../references/03-tracking-tablet.png
- ../../references/03-tracking-mobile-a.png
- ../../references/03-tracking-mobile-b.png

## HTML-структура і порядок

header → main → hero → capabilities → automation → setup → faq → final-cta → footer. Один h1; заголовки секцій h2, карток h3.

## hero: Tracking & automation

**Контент:** Connect conversion tracking, CRM feedback and revenue signals.

**HTML:** `<section id="hero" class="section hero"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Hero45/55; four-card feedback scene справа. |
| Tablet | Заголовок зверху, схема на всю ширину нижче, 4 compact horizontal nodes. |
| Mobile | Текст, CTA; схема4 вертикальні рядки Google Ads / Website / CRM / Revenue; feedback caption знизу. |

## capabilities: Know what happens after the click.

**Контент:** Conversion tracking / Lead quality / Revenue attribution.

**HTML:** `<section id="capabilities" class="section capabilities"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 3 cards у ряд, великі кольорові іконки. |
| Tablet | 3 компактні горизонтальні рядки в1 колонку. |
| Mobile | 3 cards1 колонка; іконка48 ліворуч, текст справа. |

## automation: Less manual work. More useful signals.

**Контент:** Reporting / Campaign alerts / CRM feedback / Product feed checks. AI assists analysis. People review decisions.

**HTML:** `<section id="automation" class="section automation"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Pale-yellow panel; intro35%, 2×2 automation cards65%. |
| Tablet | Intro зверху, cards2×2. |
| Mobile | Intro, 4 rows1 колонка, потім AI note14px. Не ховати уточнення про людську перевірку. |

## setup: A clear setup, step by step.

**Контент:** Audit / Map / Connect / Validate.

**HTML:** `<section id="setup" class="section setup"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 4 numbered cards горизонтально. |
| Tablet | 4 compact rows вертикально для довгих описів. |
| Mobile | 4 кроки vertical list, номер+текст. |

## faq: Frequently asked questions.

**Контент:** CRM compatibility / Offline conversions / Setup timing.

**HTML:** `<section id="faq" class="section faq"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Ліва колонка heading35%, права details65%. |
| Tablet | Heading над full-width details. |
| Mobile | Одна колонка, перше питання відкрите. |

## final-cta: Ready for clearer data?

**Контент:** Review my tracking.

**HTML:** `<section id="final-cta" class="section final-cta"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | CTA right; link audit.html?need=tracking. |
| Tablet | Текст і кнопка вряд. |
| Mobile | Full-width button з tracking preselect. |

## Специфіка сторінки

У Conversion tracking явно згадати GA4/GTM і call tracking; у Lead quality — CRM integration/offline conversions; у Revenue attribution — revenue tracking та attribution. Не додавати іконки GTM/GA4 як удавану сертифікацію. Automation cards: scheduled reporting, spend/anomaly alerts, qualified-lead feedback, feed diagnostics. API/CRM інтеграції описуються як послуга агентства; сам маркетинговий сайт не повинен підключатися до Google Ads API. Tracking CTA попередньо обирає єдине значення Tracking & Analytics після завантаження options.

## Поведінка і стани

Header/menu, CTA, details/summary та посилання — за COMPONENTS.md.

## Приймання

1. Зіставити кожну секцію з PNG відповідного пристрою; точні правила з цієї таблиці мають пріоритет.
2. Не загубити секції між Mobile A і B. Це один безперервний HTML-документ.
3. На 360/390/834/1440 перевірити заголовки, картки, поля й відсутність horizontal overflow.
4. Усі CTA/якорі працюють; табуляція проходить логічно.
5. Перевірити інший бренд через site.json і довший заголовок.
