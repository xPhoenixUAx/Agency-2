# Порядок реалізації

1. Створити 5 HTML сторінок та спільні CSS/JS. Додати навігацію за картою маршрутів.
2. Підключити config та brand.js. Перевірити зміну бренду на всіх сторінках до верстки деталей.
3. Зверстати Header/Footer, кнопки, ServiceCard, Process, FAQ.
4. Home: секції у заданому порядку. Ілюстрацію hero зібрати з окремих HTML/SVG елементів.
5. Для Home одразу пройти 1440 → 834 → 390 → 360. Потім використовувати компоненти далі.
6. Google Ads: 4 напрями; Tracking: feedback loop і automation; Results: кейси та фільтри.
7. Audit: перенести форму з form-demo.html, доповнити контентом сторінки й інтегрувати header/footer.
8. Заповнити Privacy/Terms затвердженими текстами; до того лишати noindex та draft notice.
9. Анімації додавати після готового статичного layout, перевірити reduced motion.
10. Пройти QA; протестувати handler на PHP-хостингу без надсилання клієнтам.

## Фінальне дерево

- index.html, google-ads.html, tracking-automation.html, results.html, audit.html
- privacy.html, terms.html, rebrand.html
- config/site.json
- css/base.css, css/components.css, css/pages/home.css, google-ads.css, tracking.css, results.css, audit.css
- js/brand.js, js/main.js, js/form.js, js/results.js, js/rebrand.js
- api/lead.php, api/server.php (server.example.php — зразок)
- assets/icons.svg, assets/logo.svg (опційно), assets/fonts/ (за потреби)

Не потрібен npm build. Для PHP потрібен сервер. Картинки референсів не включати в production web root.
HTML повторення header/footer для 5 сторінок допустиме. Якщо використовуєте partial loader,
спочатку вставити partials, потім один раз застосувати brand.js; не створювати CLS і дублікати ID.
Рекомендований простіший варіант — статичні header/footer у кожній сторінці.
