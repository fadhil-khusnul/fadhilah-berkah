import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Space, Switch, Drawer, ConfigProvider, theme as antdTheme } from 'antd';
import {
    DashboardOutlined,
    InboxOutlined,
    ShoppingCartOutlined,
    HistoryOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BulbOutlined,
    BulbFilled,
} from '@ant-design/icons';
import { Link, router, usePage } from '@inertiajs/react';
import { themeConfig, darkThemeConfig } from '../themeConfig';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const AppLayout = ({ children }) => {
    const { auth } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
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

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link href={ route('dashboard') }>Dashboard</Link>,
        },
        {
            key: 'pos',
            icon: <ShoppingCartOutlined />,
            label: <Link href={ route('pos.index') }>Inventory POS</Link>,
        },
        {
            key: 'transactions',
            icon: <HistoryOutlined />,
            label: <Link href={ route('transactions.index') }>Riwayat Jual</Link>,
        },
    ];

    if (isAdmin) {
        menuItems.push(
            {
                key: 'inventory',
                icon: <InboxOutlined />,
                label: <Link href={ route('inventory.index') }>Stok Barang</Link>,
            },
            {
                key: 'users',
                icon: <UserOutlined />,
                label: <Link href={ route('users.index') }>Admin & Kasir</Link>,
            }
        );
    }

    const userMenu = {
        items: [
            {
                key: 'home',
                label: <Link href="/">Home</Link>,
                icon: <ShoppingCartOutlined />
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

    const SiderBrand = (
        <div style={ {
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: collapsed ? '0' : '0 16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            transition: 'padding 0.2s'
        } }>
            <div style={ { display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12, justifyContent: 'center', width: '100%' } }>
                <div style={ {
                    width: 36,
                    height: 36,
                    backgroundColor: '#10b981',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                } }>
                    <ShoppingCartOutlined style={ { color: '#fff', fontSize: 20 } } />
                </div>
                { !collapsed && (
                    <Title level={ 5 } style={ { margin: 0, fontWeight: 800, whiteSpace: 'nowrap' } }>
                        FADHILAH<span style={ { color: '#10b981' } }>.</span>
                    </Title>
                ) }
            </div>
        </div>
    );

    return (
        <ConfigProvider
            theme={ {
                ...(isDarkMode ? darkThemeConfig : themeConfig),
                algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            } }
        >
            <Layout style={ { minHeight: '100vh' } }>
                <Sider
                    trigger={ null }
                    collapsible
                    collapsed={ collapsed }
                    collapsedWidth={ 64 }
                    width={ 260 }
                    theme={ isDarkMode ? 'dark' : 'light' }
                    className="hidden lg:block fixed"
                >
                    { SiderBrand }
                    <Menu
                        mode="inline"
                        selectedKeys={ [window.location.pathname.split('/')[1] || 'dashboard'] }
                        items={ menuItems }
                        style={ { borderRight: 0, marginTop: 16 } }
                    />
                </Sider>

                <Drawer
                    placement="left"
                    onClose={ () => setMobileOpen(false) }
                    open={ mobileOpen }
                    styles={ {
                        body: { padding: 0, backgroundColor: isDarkMode ? '#1e293b' : '#fff' },
                        header: { display: 'none' }
                    } }
                    width={ 280 }
                >
                    <div style={ { height: '100%', backgroundColor: 'inherit' } }>
                        { SiderBrand }
                        <Menu
                            mode="inline"
                            theme={ isDarkMode ? 'dark' : 'light' }
                            selectedKeys={ [window.location.pathname.split('/')[1] || 'dashboard'] }
                            items={ menuItems }
                            onClick={ () => setMobileOpen(false) }
                            style={ { borderRight: 0, marginTop: 16, backgroundColor: 'transparent' } }
                        />
                    </div>
                </Drawer>

                <Layout style={ {
                    // marginLeft: windowWidth >= 1024 ? (collapsed ? 64 : 260) : 0,
                    transition: 'margin-left 0.2s',
                    minHeight: '100vh'
                } }>
                    <Header style={ {
                        position: 'sticky',
                        top: 0,
                        zIndex: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: windowWidth < 640 ? '0 12px' : '0 24px',
                        backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                    } }>
                        <Button
                            type="text"
                            icon={ collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
                            onClick={ () => {
                                if (windowWidth < 1024) {
                                    setMobileOpen(true);
                                } else {
                                    setCollapsed(!collapsed);
                                }
                            } }
                            style={ { fontSize: 18, width: 40, height: 40 } }
                        />

                        <Space size={ windowWidth < 640 ? 12 : 24 }>
                            <div style={ { display: 'flex', alignItems: 'center', gap: 8 } } className="hidden xs:flex">
                                <BulbOutlined style={ { fontSize: 14, color: isDarkMode ? 'inherit' : '#10b981' } } />
                                <Switch size="small" checked={ isDarkMode } onChange={ toggleTheme } />
                                <BulbFilled style={ { fontSize: 14, color: isDarkMode ? '#10b981' : 'inherit' } } />
                            </div>

                            <Dropdown menu={ userMenu } placement="bottomRight" arrow>
                                <Space style={ { cursor: 'pointer' } } size={ 8 }>
                                    <div style={ { textAlign: 'right', display: 'flex', flexDirection: 'column', maxWidth: 100 } } className="hidden sm:flex">
                                        <Text strong style={ { fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }>
                                            { auth.user.name }
                                        </Text>
                                        <Text type="secondary" style={ { fontSize: 10, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap' } }>
                                            { isAdmin ? 'Administrator' : 'Kasir' }
                                        </Text>
                                    </div>
                                    <Avatar
                                        style={ { backgroundColor: '#10b981', verticalAlign: 'middle', flexShrink: 0 } }
                                        icon={ <UserOutlined /> }
                                    />
                                </Space>
                            </Dropdown>
                        </Space>
                    </Header>

                    <Content style={ { padding: '32px', minHeight: 280 } }>
                        <div style={ { maxWidth: 1200, margin: '0 auto' } } className="fade-in">
                            { children }
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AppLayout;
