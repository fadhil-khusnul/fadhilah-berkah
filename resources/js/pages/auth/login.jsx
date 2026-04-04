import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, App, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { Link, router, usePage } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';

const { Title, Text } = Typography;

const Login = () => {
    const { message } = App.useApp();
    const { errors } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    const onFinish = (values) => {
        router.post('/login', values, {
            onError: (err) => {
                const firstError = Object.values(err)[0];
                message.error(firstError || 'Email atau password salah');
            },
        });
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-1000">
                <Card
                    className={ `shadow-2xl border-none rounded-3xl overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-slate-900/90 backdrop-blur-xl border-slate-800' : 'bg-white/95 backdrop-blur-md'}` }
                    styles={ { body: { padding: '48px 40px' } } }
                >
                    <div className="text-center mb-8">
                        <div style={ {
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64,
                            backgroundColor: '#10b981',
                            borderRadius: '16px',
                            marginBottom: 24,
                            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                        } }>
                            <ShopOutlined style={ { color: 'white', fontSize: 28 } } />
                        </div>
                        <Title level={ 3 } style={ { margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: isDarkMode ? 'white' : 'inherit' } }>
                            FADHILAH<span style={ { color: '#10b981' } }>.</span>
                        </Title>
                        <Text className={ isDarkMode ? 'text-slate-400' : 'text-slate-500' } style={ { display: 'block', marginTop: 4, fontSize: 13 } }>
                            Sistem Inventory & POS Modern
                        </Text>
                    </div>

                    <Form
                        name="login"
                        layout="vertical"
                        size="large"
                        onFinish={ onFinish }
                        initialValues={ { remember: true } }
                    >
                        <Form.Item
                            name="email"
                            rules={ [
                                { required: true, message: 'Masukkan email anda' },
                                { type: 'email', message: 'Email tidak valid' }
                            ] }
                        >
                            <Input
                                prefix={ <UserOutlined className={ isDarkMode ? "text-slate-500" : "text-slate-400" } /> }
                                placeholder="Email"
                                className={ `h-12 border-slate-100/10 hover:border-emerald-400 focus:border-emerald-500 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800/50 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-100 text-slate-900'}` }
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={ [{ required: true, message: 'Masukkan password anda' }] }
                        >
                            <Input.Password
                                prefix={ <LockOutlined className={ isDarkMode ? "text-slate-500" : "text-slate-400" } /> }
                                placeholder="Password"
                                className={ `h-12 border-slate-100/10 hover:border-emerald-400 focus:border-emerald-500 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800/50 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-100 text-slate-900'}` }
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between mb-8">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className={ `${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium` }>Ingat saya</Checkbox>
                            </Form.Item>
                            <Link href={ route('password.request') } className="text-emerald-600 hover:text-emerald-500 text-sm font-semibold">
                                Lupa Password?
                            </Link>
                        </div>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-14 text-base font-bold shadow-lg shadow-emerald-500/30 rounded-xl border-none bg-emerald-500 hover:bg-emerald-600"
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className={ `mt-10 pt-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-50'} text-center` }>
                        <Text className={ `text-xs font-medium uppercase tracking-widest block mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}` }>Butuh Bantuan?</Text>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <Text className={ `text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}` }>Admin Support: 0852-5211-1128</Text>
                        </div>
                    </div>
                </Card>

                <div className="text-center mt-8">
                    <Text className="text-slate-400 text-xs font-medium">© 2026 Fadhilah Berkah.</Text>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
