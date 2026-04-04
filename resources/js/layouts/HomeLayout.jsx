import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Space, Switch, ConfigProvider, theme as antdTheme, Avatar, Dropdown } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    BulbOutlined,
    BulbFilled,
    DashboardOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Link, router, usePage } from '@inertiajs/react';
import { themeConfig, darkThemeConfig } from '../themeConfig';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

const HomeLayout = ({ children }) => {
    const { auth } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isAdmin = auth.user?.roles?.some(r => r.name === 'Admin') ?? false;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const bg = isDarkMode ? '#0f172a' : '#f8fafc';
        document.body.style.backgroundColor = bg;

        return () => window.removeEventListener('resize', handleResize);
    }, [isDarkMode]);

    const toggleTheme = (checked) => {
        const newTheme = checked ? 'dark' : 'light';
        setIsDarkMode(checked);
        localStorage.setItem('theme', newTheme);
        window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
        const bg = newTheme === 'dark' ? '#0f172a' : '#f8fafc';
        document.body.style.backgroundColor = bg;
    };

    const userMenu = {
        items: [
            {
                key: 'dashboard',
                label: <Link href={ route('dashboard') }>Dashboard</Link>,
                icon: <DashboardOutlined />
            },
            {
                key: 'profile',
                label: <Link href={ route('profile.edit') }>Profil Saya</Link>,
                icon: <UserOutlined />
            },
            { type: 'divider' },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Keluar',
                danger: true,
                onClick: () => router.post(route('logout')),
            },
        ]
    };

    return (
        <ConfigProvider
            theme={ {
                ...(isDarkMode ? darkThemeConfig : themeConfig),
                algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            } }
        >
            <Layout style={ { minHeight: '100vh', background: 'transparent' } }>
                <Header style={ {
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: windowWidth < 640 ? '0 16px' : '0 48px',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    borderBottom: 'none',
                    height: '80px'
                } }>
                    <Link href="/" style={ { display: 'flex', alignItems: 'center', gap: 12 } }>
                        <div style={ {
                            width: 36,
                            height: 36,
                            backgroundColor: '#10b981',
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        } }>
                            <ShoppingCartOutlined style={ { color: '#fff', fontSize: 20 } } />
                        </div>
                        <Title level={ 4 } style={ { margin: 0, color: '#fff', fontWeight: 800, letterSpacing: -0.5 } }>
                            FADHILAH<span style={ { color: '#10b981' } }>.</span>
                        </Title>
                    </Link>

                    <Space size={ windowWidth < 640 ? 12 : 24 }>
                        <div style={ { display: 'flex', alignItems: 'center', gap: 8 } } className="hidden xs:flex">
                            <BulbOutlined style={ { fontSize: 14, color: '#fff' } } />
                            <Switch size="small" checked={ isDarkMode } onChange={ toggleTheme } />
                            <BulbFilled style={ { fontSize: 14, color: '#fff' } } />
                        </div>

                        { auth.user ? (
                            <Dropdown menu={ userMenu } placement="bottomRight" arrow>
                                <Space style={ { cursor: 'pointer' } } size={ 12 }>
                                    <div style={ { textAlign: 'right', display: 'flex', flexDirection: 'column' } } className="hidden sm:flex">
                                        <Text strong style={ { fontSize: 13, color: '#fff', lineHeight: 1.2 } }>
                                            { auth.user.name }
                                        </Text>
                                        <Text style={ { fontSize: 10, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', fontWeight: 700 } }>
                                            { isAdmin ? 'Admin' : 'Kasir' }
                                        </Text>
                                    </div>
                                    <Avatar style={ { backgroundColor: '#10b981', border: '2px solid rgba(255,255,255,0.2)' } } icon={ <UserOutlined /> } />
                                </Space>
                            </Dropdown>
                        ) : (
                            <Link href={ route('login') }>
                                <Button
                                    type="primary"
                                    shape="round"
                                    ghost
                                    style={ { borderColor: '#fff', color: '#fff', fontWeight: 600, height: '40px', padding: '0 24px' } }
                                >
                                    Login
                                </Button>
                            </Link>
                        ) }
                    </Space>
                </Header>
                <Content style={ { padding: 0 } }>
                    { children }
                </Content>

                {/* Simple Footer */ }
                <Layout.Footer style={ { textAlign: 'center', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', padding: '48px 20px' } }>
                    <div style={ { maxWidth: 1200, margin: '0 auto' } }>
                        <Title level={ 5 } style={ { marginBottom: 16 } }>FADHILAH BERKAH INVENTORY & POS</Title>
                        <Text type="secondary">©{ new Date().getFullYear() } Modern Inventory System. All rights reserved.</Text>
                    </div>
                </Layout.Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default HomeLayout;
