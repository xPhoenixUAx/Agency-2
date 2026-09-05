# Статус перевірки паку

## Виконано

- Усі 20 PNG відкриваються; їхній вміст візуально переглянуто. Розміри записані в references/manifest.json.
- 5 посекційних MD та15 MD для окремих viewport наявні.
- Синтаксис трьох starter JS modules перевірено Node --check.
- tests/config-check.mjs пройшов: початковий конфіг, змінений бренд, невалідні кольори/email/списки/flags,
  javascript: та data: у посиланнях відхиляються.
- SVG валідний XML; локальні посилання HTML starter існують; duplicate id у starter немає.
- Логіка PHP прочитана вручну; у starter немає клієнтських секретів.
- Розбіжності зображень і точних правил описані в REFERENCE-NOTES.md.

## Не виконано в цьому середовищі

- PHP runtime відсутній: php -l, API smoke test, session/rate-limit поведінка та mail transport не виконувалися.
- Playwright доступний як бібліотека, але Chromium executable відсутній. Спроба browser test завершилась
  до запуску браузера. Layout/overflow, редагування конфігу в UI та browser form states не вважаються перевіреними.
- Реальних email не надсилали. mail() потребує налаштованого MTA; прийняття транспортом не гарантує Inbox delivery.
- П’ять фінальних HTML-сторінок ще потрібно реалізувати в Codex за паком; PNG не є доказом responsive тестів.

## Наступна перевірка під час реалізації

Запустити php -l для api/*.php, tests/php-smoke.py проти локального test-mode API,
перевірити UI на360/390/834/1440 та інші ширини з QA-CHECKLIST.md.
До запуску заповнити legal shells, config і поштові налаштування.
