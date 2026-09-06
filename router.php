<?php
// Router for the built-in PHP preview server. Apache uses .htaccess instead.
declare(strict_types=1);
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
if ($path === '/') {
    $path = '/index.html';
}
$pages = ['index.html', 'google-ads.html', 'tracking-automation.html', 'results.html',
    'audit.html', 'privacy.html', 'terms.html', 'cookies.html'];
if (in_array(ltrim($path, '/'), $pages, true)) {
    $_GET['page'] = ltrim($path, '/');
    require __DIR__ . '/render.php';
    return true;
}
if (preg_match('~(?:^|/)(?:\.|README\.md|router\.php|api/site-config\.php)~i', $path)) {
    http_response_code(404);
    return true;
}
return false;
