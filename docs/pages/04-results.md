# Case Studies — results.html

H1: **See the decisions behind the results.**

Мета: пояснити спеціалізацію та привести до заявки на аудит.

## Референси

- ../../references/04-results-desktop.png
- ../../references/04-results-tablet.png
- ../../references/04-results-mobile-a.png
- ../../references/04-results-mobile-b.png

## HTML-структура і порядок

header → main → hero → filters → case-ecommerce → case-leads → case-saas → method → final-cta → footer. Один h1; заголовки секцій h2, карток h3.

## hero: Case Studies

**Контент:** Illustrative case studies — replace with approved client results.

**HTML:** `<section id="hero" class="section hero"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Heading зліва, decorative bars справа; notice під описом. |
| Tablet | Centered heading, notice, без великого бокового арту. |
| Mobile | Heading36, notice14, один маленький декоративний motif максимум. |

## filters: Filter case studies

**Контент:** All / Ecommerce / Lead generation / B2B & SaaS.

**HTML:** `<section id="filters" class="section filters"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Inline buttons aria-pressed. |
| Tablet | Wrap при нестачі ширини, left aligned. |
| Mobile | Wrap2 ряди; min-height44; не горизонтальний carousel. |

## case-ecommerce: Scaling a product portfolio with clearer profit signals.

**Контент:** Challenge: inconsistent product performance. Strategy: restructure campaigns, improve feed signals and connect revenue quality. Result: clearer product-level decisions. Illustrative metrics: Revenue +38%, ROAS5.4x, CPA−19%.

**HTML:** `<section id="case-ecommerce" class="section case-ecommerce"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Feature panel: copy+art70%, metrics30%; narrative3 короткі колонки знизу. |
| Tablet | Copy, illustration, narrative підряд; metrics3 вряд наприкінці. |
| Mobile | Copy, small art, Challenge/Strategy/Result вертикально; metrics3 горизонтальні рядки, кожна label/value; видима illustrative позначка. |

## case-leads: Turning enquiries into qualified opportunities.

**Контент:** Challenge: high enquiry volume with uncertain quality. Strategy: CRM feedback and intent review. Result: clearer qualification signals. Illustrative case.

**HTML:** `<section id="case-leads" class="section case-leads"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Широкий ряд: intro,3 narrative columns, contact art. |
| Tablet | Одна card: intro над narrative, art компактний справа тільки якщо не стискає текст. |
| Mobile | Одна card: іконка, title,3 stacked narrative rows. Без вигаданих чисел. |

## case-saas: Connecting demo requests to pipeline.

**Контент:** Challenge: demo requests disconnected from pipeline. Strategy: align campaign intent with CRM stages. Result: more useful pipeline feedback. Illustrative case.

**HTML:** `<section id="case-saas" class="section case-saas"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Як попередня case card. |
| Tablet | Як попередня case card. |
| Mobile | Як попередня case card; не видаляти третій кейс для коротшого макета. |

## method: How we read performance.

**Контент:** Business context / Verified signals / Commercial outcomes.

**HTML:** `<section id="method" class="section method"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Intro35%, cards65% у3 колонки. |
| Tablet | Intro зверху,3 compact cards вряд. |
| Mobile | 3 compact rows, labels і один рядок опису. |

## final-cta: Want a clearer view of your account?

**Контент:** Get a free audit.

**HTML:** `<section id="final-cta" class="section final-cta"><div class="container">…</div></section>`. Сітки — CSS Grid; повторюваний контент — list/article.

| Режим | Реалізація |
|---|---|
| Desktop | Text+CTA horizontal. |
| Tablet | Text+CTA horizontal якщо поміщається. |
| Mobile | Text then full-width CTA. |

## Специфіка сторінки

Кейси відразу розмістити у HTML як article data-category; до кнопок фільтрів прив’язати vanilla JS. Числа виносити у локальний data object лише якщо реально потрібен рендеринг; вони не частина бренд-конфігу. showIllustrativeCases=false сховає всі demo статті і покаже empty state. Додайте короткий підзаголовок, що приклади демонструють структуру кейса; не писати «We achieved» без фактичних даних. Семантична група метрик — dl/dt/dd. Не поєднувати revenue currency та кількість конверсій однією віссю. У цьому паку числовий графік не потрібний.

## Поведінка і стани

Header/menu, CTA, details/summary та посилання — за COMPONENTS.md.

## Приймання

1. Зіставити кожну секцію з PNG відповідного пристрою; точні правила з цієї таблиці мають пріоритет.
2. Не загубити секції між Mobile A і B. Це один безперервний HTML-документ.
3. На 360/390/834/1440 перевірити заголовки, картки, поля й відсутність horizontal overflow.
4. Усі CTA/якорі працюють; табуляція проходить логічно.
5. Перевірити інший бренд через site.json і довший заголовок.
