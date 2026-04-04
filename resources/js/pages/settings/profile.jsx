import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, Form, Input, Button, Typography, Row, Col, Space, Alert, Divider, App } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Profile({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const { message } = App.useApp();

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const onFinish = (values) => {
        patch(route('profile.update'), {
            onSuccess: () => message.success('Profil berhasil diperbarui'),
            onError: () => message.error('Gagal memperbarui profil'),
        });
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Profil" />
            
            <div style={{ padding: '0 0 40px 0' }}>
                <Title level={2} style={{ marginBottom: 8 }}>Pengaturan Profil</Title>
                <Text type="secondary">Kelola informasi akun dan pengaturan keamanan Anda</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        {/* Profile Information */}
                        <Card 
                            title={<Space><UserOutlined /> Informasi Profil</Space>}
                            className="shadow-sm border-none rounded-2xl"
                        >
                            <Form
                                layout="vertical"
                                initialValues={data}
                                onFinish={onFinish}
                                size="large"
                            >
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Nama Lengkap"
                                            help={errors.name}
                                            validateStatus={errors.name ? 'error' : ''}
                                        >
                                            <Input 
                                                prefix={<UserOutlined />} 
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Alamat Email"
                                            help={errors.email}
                                            validateStatus={errors.email ? 'error' : ''}
                                        >
                                            <Input 
                                                prefix={<MailOutlined />} 
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <Alert
                                        message="Email belum diverifikasi"
                                        description="Silakan klik tautan verifikasi yang telah kami kirimkan ke email Anda."
                                        type="warning"
                                        showIcon
                                        style={{ marginBottom: 24 }}
                                    />
                                )}

                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        icon={<SaveOutlined />} 
                                        loading={processing}
                                        style={{ borderRadius: 8, height: 45, fontWeight: 600 }}
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>

                        {/* Dangerous Zone */}
                        <Card 
                            title={<Space style={{ color: '#ff4d4f' }}><WarningOutlined /> Zona Berisiko</Space>}
                            className="shadow-sm border-none rounded-2xl"
                            styles={{ header: { borderBottom: '1px solid #fff2f0' } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text strong block>Hapus Akun</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Setelah akun dihapus, semua data akan hilang secara permanen.</Text>
                                </div>
                                <Button danger ghost style={{ borderRadius: 8 }}>Hapus Akun</Button>
                            </div>
                        </Card>
                    </Space>
                </Col>

                <Col xs={24} lg={8}>
                    <Card 
                        title={<Space><LockOutlined /> Ubah Kata Sandi</Space>}
                        className="shadow-sm border-none rounded-2xl"
                    >
                        <PasswordForm />
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
}

function PasswordForm() {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = () => {
        put(route('user-password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                message.success('Kata sandi berhasil diperbarui');
            },
            onError: (err) => {
                if (err.current_password) {
                    message.error(err.current_password);
                } else if (err.password) {
                    message.error(err.password);
                }
            },
        });
    };

    return (
        <Form layout="vertical" onFinish={submit} size="large">
            <Form.Item
                label="Kata Sandi Saat Ini"
                help={errors.current_password}
                validateStatus={errors.current_password ? 'error' : ''}
                required
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                />
            </Form.Item>

            <Form.Item
                label="Kata Sandi Baru"
                help={errors.password}
                validateStatus={errors.password ? 'error' : ''}
                required
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                />
            </Form.Item>

            <Form.Item
                label="Konfirmasi Kata Sandi Baru"
                help={errors.password_confirmation}
                validateStatus={errors.password_confirmation ? 'error' : ''}
                required
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={processing}
                    style={{ borderRadius: 8, height: 40, fontWeight: 600 }}
                >
                    Perbarui Kata Sandi
                </Button>
            </Form.Item>
        </Form>
    );
}
