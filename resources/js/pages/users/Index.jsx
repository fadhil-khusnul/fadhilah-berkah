import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Table, Button, Input, Modal, Form, Space, Typography, Tag, Popconfirm, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const { Title, Text } = Typography;

const UserIndex = ({ users, roles }) => {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Peran',
            key: 'roles',
            render: (_, record) => (
                <Space>
                    {record.roles.map(role => (
                        <Tag color={role.name === 'Admin' ? 'purple' : 'green'} key={role.id}>
                            {role.name}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingUser(record);
                            form.setFieldsValue({
                                ...record,
                                role: record.roles[0]?.name,
                                password: '', // Reset password field
                            });
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Hapus user?"
                        onConfirm={() => router.delete(route('users.destroy', record.id))}
                        okText="Ya"
                        cancelText="Tidak"
                        disabled={record.id === auth?.user?.id}
                    >
                        <Button danger icon={<DeleteOutlined />} disabled={record.id === auth?.user?.id} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleSave = (values) => {
        if (editingUser) {
            router.put(route('users.update', editingUser.id), values, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                    form.resetFields();
                    message.success('User diperbarui');
                },
            });
        } else {
            router.post(route('users.store'), values, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    form.resetFields();
                    message.success('User ditambahkan');
                },
            });
        }
    };

    return (
        <AppLayout>
            <div className="mb-6 flex justify-between items-center sm:flex-row flex-col gap-4">
                <Title level={4}>Manajemen User</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingUser(null);
                    form.resetFields();
                    setIsModalOpen(true);
                }}>
                    Tambah Kasir
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="id"
                scroll={{ x: true }}
            />

            <Modal
                title={editingUser ? 'Edit User' : 'Tambah User'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true }]}>
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label={editingUser ? 'Password (Kosongkan Jika Tidak Diganti)' : 'Password'} 
                        rules={[{ required: !editingUser, min: 8 }]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item name="role" label="Peran" rules={[{ required: true }]} initialValue="Kasir">
                        <Select>
                            {roles.map(role => (
                                <Select.Option key={role.id} value={role.name}>{role.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>
    );
};

export default UserIndex;
