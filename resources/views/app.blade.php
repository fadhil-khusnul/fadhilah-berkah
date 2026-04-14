<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="theme-color" content="#00b96b">
        <meta name="description" content="Fadhilah Berkah Inventory & POS System">
        <meta name="format-detection" content="telephone=no">
        
        <title inertia>{{ config('app.name', 'Fadhilah Berkah') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- PWA Manifest & Meta -->
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Fadhilah Berkah">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="application-name" content="Fadhilah Berkah">
        <meta name="msapplication-TileColor" content="#00b96b">
        <meta name="msapplication-tap-highlight" content="no">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
