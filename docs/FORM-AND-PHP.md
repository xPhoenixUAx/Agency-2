# Форма та PHP handler

## Поля

| Поле name | Обов’язкове | Перевірка сервера |
|---|---|---|
| name | так | непорожнє, ≤120 bytes |
| email | так | email, без CR/LF, ≤254 bytes |
| website | так | повний http/https URL, ≤2048 bytes |
| company | ні | ≤160 bytes |
| business_type | так | значення з config.form.businessTypes |
| budget | ні | порожнє або з config.form.budgets |
| need | так | значення з config.form.needs |
| message | ні | ≤4000 bytes |
| privacy | так | точне значення 1 |
| company_url | ні | honeypot, має бути порожнім |

Серверні ліміти byte-based, тому Unicode-текст може досягти межі раніше HTML maxlength.
Це контрольований 422, не обрізання даних. Телефон не обов’язковий і в цій формі відсутній.
Обсяг POST максимум 32KB. URL не завантажується сервером. HTML у повідомленні не виконується,
лист plain text. Відсутні автоматичні відповіді на email користувача.

## Контракт

GET api/lead.php → 200 {csrf:"..."}, session cookie HttpOnly/SameSite Strict.
POST multipart FormData з csrf і полями → 200 {ok:true} лише коли транспорт прийняв лист.
422 → помилки поля; 403 → протермінована/невідповідна сесія; 429 → ліміт;
413 → завеликий payload; 503 → конфіг або mail transport недоступний; 405 → інший метод.
CSRF чинний до години, після успіху оновлюється. Після помилки токен зберігається.
Обмеження 5 POST за 10 хвилин/IP, атомарний flock у тимчасовій папці.
За reverse proxy потрібна коректна конфігурація real IP на рівні сервера; довільним X-Forwarded-For не довіряємо.
Rate bucket містить timestamp, ім’я файла — hash IP; форми не логуються і не зберігаються в браузері.

## Клієнтські стани

Initial: fetch config + session, submit disabled до готовності.
Invalid: нативна перевірка + серверна валідація; aria-invalid; фокус першому помилковому полю.
Submitting: кнопка disabled, aria-busy, status «Sending your request…».
Success: reset, конфігурований текст, фокус status; текст лишається навіть якщо fetch нового token не вдався.
Error: форму не очищати. Дозволити повторну спробу. При network error не заявляти, що сервер точно не отримав лист.
Повідомлення з errors з’являються під відповідним полем і зв’язуються через aria-describedby.
Після повторної спроби старі повідомлення очищуються.

## Налаштування хостингу

PHP 8.1+. Скопіювати api/server.example.php → api/server.php.
Задати AGENCY_MAIL_FROM справжньою адресою домену; отримувач за замовчуванням brand.email.
Опційний AGENCY_MAIL_TO має пріоритет — якщо використовуєте його, поясніть клієнту.
У php.ini production: display_errors=Off, log_errors=On, POST limit >32KB, сесії та temp writable.
Використати HTTPS. Не роздавати PHP як звичайний текст, не запускати API на статичному хостингу.
mail() вимагає MTA від хостингу. Якщо провайдер дає тільки SMTP API, замінити транспорт на
серверну інтеграцію; ключі лише в environment/server.php. Не імітувати success при помилці.
Значення true від mail() означає прийняття листа транспортом, не гарантію потрапляння у Inbox.
Перед production перевірити доставку у тестову поштову скриньку та налаштування домену з хостером.

## Локальна перевірка без зовнішніх листів

Handler підтримує лише для тесту AGENCY_ENV=test та AGENCY_TEST_OUTBOX=існуюча локальна папка.
Тоді plain-text тіло пишеться в цю папку замість mail(). Mail from/to все одно мають бути валідними,
не example.com. Використовуйте зарезервований test-домен лише в test mode (напр. qa@agency.test).
Не задавайте ці змінні на production. Видаліть тестові тіла після перевірки.
У пак включено tests/php-smoke.py — запускається проти локального PHP server у test mode.
