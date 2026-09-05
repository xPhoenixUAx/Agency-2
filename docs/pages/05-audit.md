# Free Audit — audit.html

H1: **Let's find your next growth opportunity.**

Мета: отримати релевантну заявку на аудит.

## Референси

- ../../references/05-audit-desktop.png
- ../../references/05-audit-tablet.png
- ../../references/05-audit-mobile-a.png
- ../../references/05-audit-mobile-b.png

## HTML-структура і порядок

header → main → intro → audit-form → next → faq → footer. Один h1; заголовки секцій h2, карток h3.

## intro: Request a free audit

**Контент:** Tell us about your business. We will review your goals and the next useful steps.

**HTML:** `<section id="intro" class="section intro"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Ліва колонка42%: H1, copy,3 benefits, email. Праворуч form58%. |
| Tablet | Intro зверху;3 benefit chips у ряд, form нижче width100%. |
| Mobile | Intro H136, copy16;3 benefits компактними рядками; form нижче. Не робити sticky intro. |

## audit-form: Request your free Google Ads audit

**Контент:** Name / Business email / Website / Company optional / Business type / Monthly budget optional / Need / Message optional / Privacy / Submit.

**HTML:** `<section id="audit-form" class="section audit-form"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Form card padding32,2 колонки полів; Need/Message/Privacy/Submit full row. |
| Tablet | Form card24,2 колонки полів, full rows як desktop. |
| Mobile | Form card20, всі поля1 колонка у незмінному порядку; input font16,min-height48; label над полем. |

## next: What happens next?

**Контент:** Review your request / Discuss access and goals / Agree on next steps.

**HTML:** `<section id="next" class="section next"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 3 colorful cards horizontally. |
| Tablet | 3 compact cards; якщо текст не вміщається —1 колонка. |
| Mobile | 3 numbered rows vertically. Не обіцяти час відповіді без підтвердження. |

## faq: Before you submit

**Контент:** Account access / Minimum budget.

**HTML:** `<section id="faq" class="section faq"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | 2 details max-width920 centered. |
| Tablet | 2 details full width. |
| Mobile | 2 full-width details. Ніякого додаткового sticky CTA поверх форми. |

## Специфіка сторінки

Код стартової форми — starter/form-demo.html, js/form.js, api/lead.php. Збережіть field name; перенесіть у повний audit.html з benefits/next/faq. Обов’язкові name/email/website/business_type/need/privacy; company/budget/message optional. No prechecked checkbox. Сповіщення success/error завжди поряд із submit і доступне screen reader. На вузькому екрані нативні select, не custom dropdown. Не зберігати персональні поля у localStorage. Після помилки не скидати введені дані. Всі email, legal name, address із config.

## Поведінка і стани

Форма: Initial → Validating → Sending → Success/Error, див. FORM-AND-PHP.md.

## Приймання

1. Зіставити кожну секцію з PNG відповідного пристрою; точні правила з цієї таблиці мають пріоритет.
2. Не загубити секції між Mobile A і B. Це один безперервний HTML-документ.
3. На 360/390/834/1440 перевірити заголовки, картки, поля й відсутність horizontal overflow.
4. Усі CTA/якорі працюють; табуляція проходить логічно.
5. Перевірити інший бренд через site.json і довший заголовок.
