<?php
declare(strict_types=1);
ini_set('display_errors', '0');
require_once __DIR__ . '/api/site-config.php';

$page = $_GET['page'] ?? 'index.html';
if (!is_string($page) || !in_array($page, site_pages(), true)) {
    http_response_code(404);
    exit('Page not found.');
}
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
try {
    $config = site_config();
    $html = file_get_contents(__DIR__ . '/' . $page);
    if (!is_string($html)) {
        throw new RuntimeException('Page unavailable.');
    }
    $document = new DOMDocument('1.0', 'UTF-8');
    $previousErrors = libxml_use_internal_errors(true);
    $document->loadHTML('<?xml encoding="UTF-8">' . $html, LIBXML_NONET);
    libxml_clear_errors();
    libxml_use_internal_errors($previousErrors);
    foreach (iterator_to_array($document->childNodes) as $node) {
        if ($node->nodeType === XML_PI_NODE) {
            $document->removeChild($node);
        }
    }
    $xpath = new DOMXPath($document);
    $text = static function (DOMNode $element, string $value) use ($document): void {
        while ($element->firstChild) {
            $element->removeChild($element->firstChild);
        }
        $element->appendChild($document->createTextNode($value));
    };
    foreach (['brand', 'content'] as $group) {
        foreach ($xpath->query('//*[@data-' . $group . ']') as $element) {
            $key = $element->getAttribute('data-' . $group);
            $value = $config[$group][$key] ?? null;
            if (!is_string($value)) {
                continue;
            }
            // Preserve the original hero line break and accent when its copy is unchanged.
            if ($element->hasAttribute('data-title-first') && $value ===
                $element->getAttribute('data-title-first') . ' ' .
                $element->getAttribute('data-title-second') . $element->getAttribute('data-title-accent')) {
                continue;
            }
            $text($element, $value);
        }
    }
    foreach ($xpath->query('//*[@data-email or @data-privacy-email]') as $element) {
        $email = $element->hasAttribute('data-privacy-email')
            ? ($config['legal']['privacyEmail'] ?? '') ?: $config['brand']['email']
            : $config['brand']['email'];
        $text($element, $email);
        $element->setAttribute('href', 'mailto:' . $email);
    }
    foreach ($xpath->query('//*[@data-business-website]') as $element) {
        $text($element, $config['brand']['website']);
        $element->setAttribute('href', $config['brand']['website']);
    }
    foreach ($xpath->query('//*[@data-legal]') as $element) {
        $key = $element->getAttribute('data-legal');
        $value = $config['legal'][$key] ?? '';
        if ($value === '') {
            continue;
        }
        if ($key === 'updatedOn') {
            $element->setAttribute('datetime', $value);
            $value = (new DateTimeImmutable($value))->format('F j, Y');
        }
        $text($element, $value);
    }
    foreach ($xpath->query('//*[@data-legal-optional]') as $element) {
        if (($config['legal'][$element->getAttribute('data-legal-optional')] ?? '') !== '') {
            $element->removeAttribute('hidden');
        } else {
            $element->setAttribute('hidden', '');
        }
    }
    foreach ($xpath->query('//*[@data-authority-link]') as $element) {
        $url = $config['legal']['supervisoryAuthorityUrl'] ?? '';
        if ($url !== '') {
            $element->setAttribute('href', $url);
            $element->removeAttribute('hidden');
        }
    }
    foreach ($xpath->query('//*[@data-year]') as $element) {
        $text($element, date('Y'));
    }
    foreach ($xpath->query('//*[@data-logo]') as $element) {
        if ($config['brand']['logo'] === '') {
            continue;
        }
        $image = $document->createElement('img');
        $image->setAttribute('src', $config['brand']['logo']);
        $image->setAttribute('alt', $config['brand']['name']);
        $text($element, '');
        $element->appendChild($image);
    }
    foreach ($xpath->query('//*[@data-favicon]') as $element) {
        $element->setAttribute('href', $config['brand']['favicon']);
        $element->removeAttribute('sizes');
        $element->removeAttribute('type');
    }
    foreach ($xpath->query('//select[@data-options]') as $element) {
        $text($element, '');
        $placeholder = $document->createElement('option');
        $placeholder->setAttribute('value', '');
        $text($placeholder, $element->getAttribute('data-placeholder') ?: 'Select an option');
        $element->appendChild($placeholder);
        foreach ($config['form'][$element->getAttribute('data-options')] as $value) {
            $option = $document->createElement('option');
            $option->setAttribute('value', $value);
            $text($option, $value);
            $element->appendChild($option);
        }
    }
    foreach ($xpath->query('//*[@data-illustrative]') as $element) {
        if (!$config['features']['showIllustrativeCases']) {
            $element->setAttribute('hidden', '');
        }
    }
    foreach ($xpath->query('//*[@data-case-filters or @data-cases-empty]') as $element) {
        $visible = $element->hasAttribute('data-cases-empty')
            ? !$config['features']['showIllustrativeCases'] : $config['features']['showIllustrativeCases'];
        if ($visible) {
            $element->removeAttribute('hidden');
        } else {
            $element->setAttribute('hidden', '');
        }
    }
    if (!$config['features']['showIllustrativeCases']) {
        foreach ($xpath->query('//*[@data-filter-status]') as $element) {
            $text($element, 'Approved case studies will be added here.');
        }
    }
    $text($document->getElementsByTagName('title')->item(0),
        $config['pageTitles'][$page] . ' | ' . $config['brand']['name']);
    // Ship the same validated snapshot to JS, avoiding mixed config versions in one response.
    $snapshot = $document->createElement('script');
    $snapshot->setAttribute('id', 'site-config');
    $snapshot->setAttribute('type', 'application/json');
    $snapshotJson = json_encode($config,
        JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE);
    // HTML serialization can entity-encode Unicode inside a text node. JSON in a script
    // is raw text, so inject the already JSON_HEX-escaped payload after serialization.
    $snapshot->appendChild($document->createTextNode('__SITE_CONFIG_JSON__'));
    $document->getElementsByTagName('head')->item(0)->appendChild($snapshot);
    echo str_replace(
        '<script id="site-config" type="application/json">__SITE_CONFIG_JSON__</script>',
        '<script id="site-config" type="application/json">' . $snapshotJson . '</script>',
        $document->saveHTML()
    );
} catch (Throwable $error) {
    http_response_code(503);
    echo '<!doctype html><html lang="en"><meta charset="utf-8"><title>Site temporarily unavailable</title>' .
        '<h1>Site temporarily unavailable</h1><p>The site configuration could not be loaded. Please try again later.</p></html>';
}
