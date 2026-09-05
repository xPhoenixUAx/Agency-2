# Розширення сервісних сторінок

За запитом користувача обидві сторінки розширено з 6 до 10 секцій. Палітра, типографіка, картки та композиції продовжують затверджений напрям референсів. Додано предметні описи та по 6 FAQ; вихідні PNG показують попередній обсяг.

## Google Ads

Hero → campaign strategy → channels → account deliverables → process → creative testing → performance review → outcomes → FAQ → CTA.

Нові блоки пояснюють вибір рекламного міксу, склад робіт, узгодження реклами й посадкової сторінки, тестування та інтерпретацію даних для лідів, ecommerce і pipeline. Описи чотирьох каналів розширено.

## Tracking & automation

Hero → measurement plan → capabilities → CRM integration → automation → validation → setup → handover → FAQ → CTA.

Нові блоки пояснюють визначення подій, повернення CRM-результатів, перевірку тригерів/параметрів/узгодженості даних та документацію для команди. Сумісність CRM і обсяг робіт уточнюються після огляду.

## Файли

Авторський модуль: `tools/service_content.py`; підключення: `tools/build_pages.py`; адаптація: `web/css/pages/service-expanded.css`. На хостингу залишаються звичайні HTML/CSS/JS/PHP.

Чотири завершені растрові ілюстрації створено через **вбудований ImageGen**, не CLI. Оригінали збережено в проєкті; WebP — конвертація через Sharp без перемальовування. Планувальник використовує перевірену версію v2 з іконками товарного фіда. Відхилений варіант не використовується сайтом.

| Ілюстрація | Фінальний PNG | Файл сайту |
|---|---|---|
| service-campaign-planning | `E:/lp/Agency-2/artifacts/generated/service-campaign-planning-v2.png` | `E:/lp/Agency-2/web/assets/images/service-campaign-planning.webp` |
| service-creative-testing | `E:/lp/Agency-2/artifacts/generated/service-creative-testing.png` | `E:/lp/Agency-2/web/assets/images/service-creative-testing.webp` |
| service-event-validation | `E:/lp/Agency-2/artifacts/generated/service-event-validation.png` | `E:/lp/Agency-2/web/assets/images/service-event-validation.webp` |
| service-crm-feedback | `E:/lp/Agency-2/artifacts/generated/service-crm-feedback.png` | `E:/lp/Agency-2/web/assets/images/service-crm-feedback.webp` |

## Перевірки

- 45 перевірок: 5 сторінок × 9 ширин (360–1920px), без горизонтального скролу.
- Клавіатура, меню, FAQ, фільтри, форма та її помилки/повтор/успіх, tracking preselect.
- Довгий бренд, різні логотипи, збільшення тексту до 200%, помилка конфігу.
- Склад і порядок 10 секцій на кожній сервісній сторінці; 6 FAQ на кожній.
- Chrome screenshots на 390/834/1440px, окремі скриншоти змістових секцій; усі зображення декодуються.
- Локальні посилання, HTML і конфіг перевірено статичними скриптами.

Safari, фізичні мобільні пристрої, публічний хостинг і реальна доставка пошти цим проходом не перевірялись. PHP API не змінювався.

## Промпти ImageGen

### service-campaign-planning

Стильовий референс: `references/02-google-ads-desktop.png`.

Create a finished professional raster editorial illustration for the SIGNAL performance advertising agency website. Landscape 1536x1024. Match the provided website reference ONLY for illustration style: clean front-facing white UI cards, very pale blue rounded background shapes, saturated blue #4285F4, green #34A853, yellow #FBBC05 and red #EA4335 accents, friendly polished flat illustration with delicate shading and soft contact shadows. Pure white outer margins. Large readable composition with 3-5 main elements. NOT photorealistic, NOT heavy 3D, no glass sculpture, no shoes, no clothing, no physical merchandise, no people photos, no badges, no partner claims, no Google logos, no made-up performance percentages, no watermark. This is a standalone visual placed beside native HTML content, NOT a full webpage. Subject: campaign planning connecting customer intent to the right ad channel. A substantial central campaign planner board with three beautiful horizontally aligned campaign cards, headed exactly 'Search', 'Shopping', 'Video'. Search card has a blue magnifier, Shopping a green shopping-bag symbol, Video a red play symbol. Above them a slim white brief card with a large blue target icon and exact title 'Business goals'. Below the campaign cards a golden priority chip labeled 'Budget'. Curved thin blue connectors clearly link goals to the channels and budget. Include small coloured audience tokens and creative thumbnails within cards. Strong visual hierarchy, plenty of breathing room, crisp real typography. Avoid generic placeholder dashboards.

### service-creative-testing

Стильовий референс: `references/02-google-ads-desktop.png`.

Create a finished professional raster editorial illustration for the SIGNAL performance advertising agency website. Landscape 1536x1024. Match the provided website reference ONLY for illustration style: clean front-facing white UI cards, very pale blue rounded background shapes, saturated blue #4285F4, green #34A853, yellow #FBBC05 and red #EA4335 accents, friendly polished flat illustration with delicate shading and soft contact shadows. Pure white outer margins. Large readable composition with 3-5 main elements. NOT photorealistic, NOT heavy 3D, no glass sculpture, no shoes, no clothing, no physical merchandise, no people photos, no badges, no partner claims, no Google logos, no made-up performance percentages, no watermark. This is a standalone visual placed beside native HTML content, NOT a full webpage. Subject: Google Ads creative and landing-page testing. Two large polished ad preview cards side by side, labeled exactly 'Message A' and 'Message B', with distinct finished graphic compositions: A has a blue target and short headline 'Find the right fit', B has a green customer-check symbol and headline 'Take the next step'. Behind them a larger white browser landing page titled 'Your next customer', with a beautiful four-colour abstract editorial banner and blue call-to-action rectangle. A modest red/yellow testing-switch symbol and a small blue magnifier connect the two ad cards to the browser. No winner stamp or numerical claims. Make this feel like a thoughtful creative studio board with tangible polished cards, not a wireframe of grey lines.

### service-event-validation

Стильовий референс: `references/03-tracking-desktop.png`.

Create a finished professional raster editorial illustration for the SIGNAL performance advertising agency website. Landscape 1536x1024. Match the provided website reference ONLY for illustration style: clean front-facing white UI cards, very pale blue rounded background shapes, saturated blue #4285F4, green #34A853, yellow #FBBC05 and red #EA4335 accents, friendly polished flat illustration with delicate shading and soft contact shadows. Pure white outer margins. Large readable composition with 3-5 main elements. NOT photorealistic, NOT heavy 3D, no glass sculpture, no shoes, no clothing, no physical merchandise, no people photos, no badges, no partner claims, no Google logos, no made-up performance percentages, no watermark. This is a standalone visual placed beside native HTML content, NOT a full webpage. Subject: checking that website actions are measured correctly. A large clean browser window with a blue cursor clicking a contact-form submit area, a smaller adjacent phone screen showing a call symbol, and a white event-inspection panel with exactly three rows 'Form submitted', 'Call connected', 'Purchase recorded'. Each row has a precise green circular check, plus a subtle blue connection line from the relevant action. The event panel is the main focal point; small polished yellow magnifier at bottom edge expresses verification. Rounded pale blue halo behind the scene, a restrained green arc and red dot. Distinct finished icons, generous typography, clean diagrams integrated in an engaging editorial illustration. No code or fake analytics metrics.

### service-crm-feedback

Стильовий референс: `references/03-tracking-desktop.png`.

Create a finished professional raster editorial illustration for the SIGNAL performance advertising agency website. Landscape 1536x1024. Match the provided website reference ONLY for illustration style: clean front-facing white UI cards, very pale blue rounded background shapes, saturated blue #4285F4, green #34A853, yellow #FBBC05 and red #EA4335 accents, friendly polished flat illustration with delicate shading and soft contact shadows. Pure white outer margins. Large readable composition with 3-5 main elements. NOT photorealistic, NOT heavy 3D, no glass sculpture, no shoes, no clothing, no physical merchandise, no people photos, no badges, no partner claims, no Google logos, no made-up performance percentages, no watermark. This is a standalone visual placed beside native HTML content, NOT a full webpage. Subject: qualified lead feedback from CRM to advertising. A compact three-column CRM board with exact column labels 'New enquiry', 'Qualified', 'Customer'. Each column contains one well-designed contact card, with a large human profile icon; first blue, second green with check, final warm yellow with small business-outcome symbol. A bold but elegant blue return arrow curves under the board from Customer back to a separate blue campaign target token on the left. A small clean caption chip reads exactly 'Feedback to campaigns'. Pure white UI, subtle pale blue and pale green background arcs, rounded card shapes, precise soft shading. Treat this as a finished high-quality conceptual illustration, not a screenshot of a real CRM product. No real personal details, company logos or quantitative results.

### Уточнення фінального планувальника v2

Edit target: `artifacts/generated/service-campaign-planning.png`. Фінальний файл: `artifacts/generated/service-campaign-planning-v2.png`.

Use case: precise-object-edit. Edit the supplied campaign-planning illustration. Change ONLY the three product thumbnails inside the middle Shopping panel: remove the shoe, backpack and bottle completely and replace each with a crisp green product-feed document icon (a rounded document with a small green shopping-bag symbol and two short metadata lines). These must represent advertising feed records, not physical products. No footwear, clothing or physical merchandise anywhere. Preserve the full composition, every existing text label, colors, other panels, proportions, white margins and soft illustration style exactly. Output a finished 1536x1024 raster image.

