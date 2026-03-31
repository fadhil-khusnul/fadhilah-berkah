import { createInertiaApp } from '@inertiajs/react';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '../css/app.css';
import { themeConfig, darkThemeConfig } from './themeConfig';

// Register PWA Service Worker
if (typeof window !== 'undefined') {
    registerSW({
        onNeedRefresh() {
            console.log('PWA: Content updated, please refresh');
        },
        onOfflineReady() {
            console.log('PWA: Ready to work offline');
        },
    });
}

const appName = import.meta.env.VITE_APP_NAME || 'Fadhilah Berkah';

const AppWrapper = ({ App, props }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail === 'dark');
        };
        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, []);

    const currentTheme = isDarkMode ? darkThemeConfig : themeConfig;

    return (
        <ConfigProvider 
            theme={{
                ...currentTheme,
                algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            }}
        >
            <AntdApp>
                <App {...props} />
            </AntdApp>
        </ConfigProvider>
    );
};

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <StrictMode>
                <AppWrapper App={App} props={props} />
            </StrictMode>
        );
    },
    progress: {
        color: '#10b981',
    },
});
