# Як запускати

## Подивитись пак

Відкрийте references/index.html у браузері. Це каталог зображень, сервер не потрібний.

## Ребрендинг і форма

Для конфігу з fetch потрібен HTTP-сервер. Файл подвійним кліком через file:// не підходить.
У terminal Codex або VS Code перейдіть у папку starter.

```sh
php -S 127.0.0.1:8080
```

Відкрийте http://127.0.0.1:8080/form-demo.html або http://127.0.0.1:8080/rebrand.html.
Якщо php не знайдено, PHP ще не встановлено або не додано до PATH.
Для перегляду тільки UI/редактора можна використати Live Server у VS Code:
PHP-обробник у Live Server не виконується, submit буде недоступний — це очікувано.

## Тест API без поштової доставки, Bash

З папки starter створіть тимчасову папку outbox поза web root.

```sh
mkdir -p ../test-outbox
AGENCY_ENV=test AGENCY_TEST_OUTBOX="$(pwd)/../test-outbox" AGENCY_MAIL_FROM=sender@agency.test AGENCY_MAIL_TO=qa@agency.test php -S 127.0.0.1:8080
```

В іншому терміналі з кореня паку:

```sh
python3 tests/php-smoke.py http://127.0.0.1:8080
```

PowerShell: ці змінні задаються через $env:AGENCY_ENV='test' тощо, потім php -S.
Для звичайного завершення сервера Ctrl+C. Папку test-outbox видалити після тесту.
