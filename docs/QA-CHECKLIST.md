# Приймання готового сайту

## Layout

- Контрольні viewport: 360,390,768,834,1024,1199,1200,1440,1920.
- scrollWidth <= clientWidth; жодних великих min-width у grid children.
- Контейнер border-box не перевищує1440; gutters 48/32/20.
- На mobile hero одна колонка: heading, copy, CTA, illustration; не side-by-side.
- На tablet немає одночасно повної desktop nav і hamburger.
- Текст збільшений до200% залишається доступним; zoom не вимкнений.
- Cards height auto; всі іконки, довгі назви та селекти поміщаються.

## Взаємодія

- Всі кнопки ведуть на існуючі адреси/якорі; немає href="#" без цільового id.
- Menu відкривається клавіатурою, має close/Escape, повертає focus, unlock scroll.
- FAQ без JS; фільтри cases працюють і повідомляють кількість.
- Config змінює бренд на всіх сторінках, не лише на головній.
- Перевірити назву 30–40 символів, вузький і широкий логотип, іншу email адресу.
- showIllustrativeCases=false приховує цифри та показує потрібний empty state.
- Форма: порожня, невірний email, невірний URL, array input, невідома опція, honeypot,
  expired CSRF, double click, 429, mail failure, offline, success, повторна заявка.
- Network помилка не очищає введені дані; success тільки після JSON ok=true.

## Доступність і контент

- Одна h1, логічні h2/h3; label/control; focus visible; min touch44.
- Іконки декоративні aria-hidden; змістовна графіка має текстовий еквівалент.
- Ілюстративні цифри не видаються за справжні. Brand affiliation не вигадується.
- Контраст після ребрендингу перевірений; колір не є єдиним error indicator.
- Reduced motion, JS failure і config failure перевірені.
- Privacy/Terms затверджені власником; starter noindex знято лише на готових сторінках.

## Production

- Референси, docs, тести й outbox не потрапляють у web root.
- PHP виконується; secrets не у JSON/JS; HTTPS; server mail settings перевірені.
- Тестова доставка перевірена адресатом; mail accepted не прирівнюється до Inbox delivery.
- Немає стороннього tracking без погодженого налаштування.
