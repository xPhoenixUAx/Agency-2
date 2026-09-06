<?php
declare(strict_types=1);

// Shared by the page renderer and the lead handler. site.json contains public data only.
function site_config(): array
{
    $raw = @file_get_contents(__DIR__ . '/../config/site.json');
    if (!is_string($raw)) {
        throw new RuntimeException('Cannot read site configuration.');
    }
    $config = json_decode(preg_replace('/^\xEF\xBB\xBF/', '', $raw), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($config)) {
        throw new RuntimeException('Invalid site configuration.');
    }
    array_walk_recursive($config, static function (&$value): void {
        if (is_string($value)) {
            $value = trim($value);
        }
    });
    foreach (['name', 'legalName', 'description', 'email', 'address', 'website', 'logo', 'favicon'] as $key) {
        if (!is_string($config['brand'][$key] ?? null) || ($key !== 'logo' && $config['brand'][$key] === '')) {
            throw new RuntimeException('Invalid brand.' . $key);
        }
    }
    if (!site_email($config['brand']['email'])) {
        throw new RuntimeException('Invalid contact email.');
    }
    $website = parse_url($config['brand']['website']);
    if (!filter_var($config['brand']['website'], FILTER_VALIDATE_URL) ||
        !in_array($website['scheme'] ?? '', ['http', 'https'], true) ||
        isset($website['user']) || isset($website['pass']) ||
        isset($website['query']) || isset($website['fragment'])) {
        throw new RuntimeException('Invalid website base URL.');
    }
    foreach (['logo', 'favicon'] as $key) {
        if ($config['brand'][$key] !== '' && !site_asset_url($config['brand'][$key])) {
            throw new RuntimeException('Invalid brand.' . $key);
        }
    }
    foreach (site_pages() as $page) {
        if (!is_string($config['pageTitles'][$page] ?? null) || $config['pageTitles'][$page] === '') {
            throw new RuntimeException('Missing page title: ' . $page);
        }
    }
    foreach (['recipient', 'from', 'subject'] as $key) {
        $value = $config['mail'][$key] ?? null;
        if (!is_string($value) || preg_match('/[\r\n]/', $value) ||
            ($key !== 'subject' && $value !== '' && !site_email($value)) ||
            ($key === 'subject' && $value === '')) {
            throw new RuntimeException('Invalid mail.' . $key);
        }
    }
    foreach (['businessTypes', 'budgets', 'needs'] as $key) {
        $values = $config['form'][$key] ?? null;
        if (!is_array($values) || !array_is_list($values) || !$values) {
            throw new RuntimeException('Invalid form.' . $key);
        }
        foreach ($values as $value) {
            if (!is_string($value) || $value === '' || strlen($value) > 100) {
                throw new RuntimeException('Invalid form option.');
            }
        }
    }
    if (!in_array($config['form']['trackingNeed'] ?? null, $config['form']['needs'], true)) {
        throw new RuntimeException('Invalid tracking service option.');
    }
    foreach (['heroTitle', 'heroDescription', 'cta', 'trackingCta', 'submit', 'success'] as $key) {
        if (!is_string($config['content'][$key] ?? null) || $config['content'][$key] === '') {
            throw new RuntimeException('Invalid content.' . $key);
        }
    }
    if (!is_bool($config['features']['showIllustrativeCases'] ?? null)) {
        throw new RuntimeException('Invalid case visibility setting.');
    }
    if (array_key_exists('legal', $config) && !is_array($config['legal'])) {
        throw new RuntimeException('Invalid legal settings.');
    }
    foreach ($config['legal'] ?? [] as $value) {
        if (!is_string($value)) {
            throw new RuntimeException('Legal settings must be text.');
        }
    }
    $date = $config['legal']['updatedOn'] ?? '';
    if ($date !== '') {
        $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
        if (!$parsed || $parsed->format('Y-m-d') !== $date) {
            throw new RuntimeException('Invalid policy date.');
        }
    }
    $privacyEmail = $config['legal']['privacyEmail'] ?? '';
    if ($privacyEmail !== '' && !site_email($privacyEmail)) {
        throw new RuntimeException('Invalid privacy email.');
    }
    $authority = $config['legal']['supervisoryAuthorityUrl'] ?? '';
    if ($authority !== '' && (!filter_var($authority, FILTER_VALIDATE_URL) ||
        !in_array(parse_url($authority, PHP_URL_SCHEME), ['http', 'https'], true))) {
        throw new RuntimeException('Invalid authority URL.');
    }
    return $config;
}

function site_pages(): array
{
    return ['index.html', 'google-ads.html', 'tracking-automation.html', 'results.html',
        'audit.html', 'privacy.html', 'terms.html', 'cookies.html'];
}

function site_email(string $value): bool
{
    return !preg_match('/[\r\n]/', $value) && filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
}

function site_asset_url(string $value): bool
{
    if (preg_match('/[\x00-\x20\\\\]/', $value)) {
        return false;
    }
    if (preg_match('/^[a-z][a-z0-9+.-]*:/i', $value)) {
        return filter_var($value, FILTER_VALIDATE_URL) !== false &&
            in_array(parse_url($value, PHP_URL_SCHEME), ['http', 'https'], true);
    }
    return !str_starts_with($value, '//');
}
