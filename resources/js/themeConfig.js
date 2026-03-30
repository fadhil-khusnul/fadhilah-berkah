import { theme } from 'antd';

export const themeConfig = {
    token: {
        colorPrimary: '#10b981', // Emerald 500
        colorInfo: '#10b981',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b', // Amber 500
        colorError: '#ef4444',
        borderRadius: 12,
        fontFamily: "'Inter', sans-serif",
    },
    components: {
        Layout: {
            headerBg: '#ffffff',
            siderBg: '#ffffff',
            bodyBg: '#f8fafc',
            headerHeight: 64,
            headerPadding: '0 24px',
        },
        Menu: {
            itemBorderRadius: 8,
            itemActiveBg: '#f0fdf4',
            itemSelectedBg: '#f0fdf4',
            itemSelectedColor: '#10b981',
            itemHoverColor: '#10b981',
        },
        Card: {
            borderRadiusLG: 20,
            boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
    },
};

export const darkThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        ...themeConfig.token,
        colorBgBase: '#0f172a',
        colorBgContainer: '#1e293b',
        colorBorder: '#334155',
        colorTextBase: '#f8fafc',
    },
    components: {
        ...themeConfig.components,
        Layout: {
            headerBg: '#1e293b',
            siderBg: '#0f172a',
            bodyBg: '#0f172a',
            headerHeight: 64,
            headerPadding: '0 24px',
        },
        Menu: {
            itemActiveBg: '#1e293b',
            itemSelectedBg: '#1e293b',
            itemSelectedColor: '#10b981',
            itemHoverColor: '#10b981',
        },
    },
};
