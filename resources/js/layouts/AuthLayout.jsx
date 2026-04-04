import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, theme as antdTheme } from 'antd';
import { themeConfig, darkThemeConfig } from '../themeConfig';

const { Content } = Layout;

const AuthLayout = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        const bg = isDarkMode ? '#0f172a' : '#f8fafc';
        document.body.style.backgroundColor = bg;
        
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail === 'dark');
        };
        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, [isDarkMode]);

    return (
        <ConfigProvider 
            theme={{
                ...(isDarkMode ? darkThemeConfig : themeConfig),
                algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            }}
        >
            <Layout style={{ 
                minHeight: '100vh', 
                background: isDarkMode 
                    ? 'radial-gradient(circle at top right, #064e3b, #0f172a)' 
                    : 'radial-gradient(circle at top right, #ecfdf5, #f8fafc)'
            }}>
                <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    {children}
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default AuthLayout;
