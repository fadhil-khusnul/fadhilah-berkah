import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Table, Button, Input, Modal, Form, InputNumber, Space, Typography, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, SwapOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const { Title, Text } = Typography;
const { Search } = Input;

const InventoryIndex = ({ products, filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [adjustingProduct, setAdjustingProduct] = useState(null);
    const [form] = Form.useForm();
    const [adjustForm] = Form.useForm();

    const columns = [
        {
            title: 'Nama Barang',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Harga Jual',
            dataIndex: 'selling_price',
            key: 'selling_price',
            render: (price) => `Rp ${number_format(price)}`,
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock < 5 ? 'volcano' : 'green'}>
                    {stock} {products.data.find(p => p.stock === stock)?.unit || 'pcs'}
                </Tag>
            ),
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<SwapOutlined />} 
                        onClick={() => {
                            setAdjustingProduct(record);
                            setIsAdjustModalOpen(true);
                        }}
                    >
                        Stok
                    </Button>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingProduct(record);
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Hapus barang?"
                        onConfirm={() => router.delete(route('inventory.destroy', record.id))}
                        okText="Ya"
                        cancelText="Tidak"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                    <Button 
                        icon={<HistoryOutlined />} 
                        onClick={() => router.get(route('inventory.history', record.id))}
                    />
                </Space>
            ),
        },
    ];

    const number_format = (val) => new Intl.NumberFormat('id-ID').format(val);

    const handleSave = (values) => {
        if (editingProduct) {
            router.put(route('inventory.update', editingProduct.id), values, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    form.resetFields();
                    message.success('Barang diperbarui');
                },
            });
        } else {
            router.post(route('inventory.store'), values, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    form.resetFields();
                    message.success('Barang ditambahkan');
                },
            });
        }
    };

    const handleAdjust = (values) => {
        router.post(route('inventory.adjust', adjustingProduct?.id), values, {
            onSuccess: () => {
                setIsAdjustModalOpen(false);
                adjustForm.resetFields();
                message.success('Stok disesuaikan');
            },
        });
    };

    return (
        <MainLayout>
            <div className="mb-6 flex justify-between items-center sm:flex-row flex-col gap-4">
                <Title level={4}>Manajemen Inventaris</Title>
                <div className="flex gap-4 sm:flex-row flex-col w-full sm:w-auto">
                    <Search
                        placeholder="Cari barang..."
                        allowClear
                        onSearch={(v) => router.get(route('inventory.index'), { search: v }, { preserveState: true })}
                        style={{ width: 250 }}
                        defaultValue={filters.search}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setEditingProduct(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }}>
                        Tambah Barang
                    </Button>
                </div>
            </div>

            <Table 
                columns={columns} 
                dataSource={products.data} 
                rowKey="id"
                pagination={{
                    current: products.current_page,
                    pageSize: products.per_page,
                    total: products.total,
                    onChange: (page) => router.get(route('inventory.index'), { page, search: filters.search }),
                }}
            />

            {/* Add/Edit Modal */}
            <Modal
                title={editingProduct ? 'Edit Barang' : 'Tambah Barang'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Nama Barang" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="selling_price" label="Harga Jual (Rp)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="unit" label="Satuan" rules={[{ required: true }]} initialValue="pcs">
                        <Input />
                    </Form.Item>
                    {!editingProduct && (
                        <Form.Item name="stock" label="Stok Awal" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* Adjust Modal */}
            <Modal
                title={`Sesuaikan Stok: ${adjustingProduct?.name}`}
                open={isAdjustModalOpen}
                onCancel={() => setIsAdjustModalOpen(false)}
                onOk={() => adjustForm.submit()}
            >
                <Form form={adjustForm} layout="vertical" onFinish={handleAdjust}>
                    <Form.Item name="type" label="Tipe Penyesuaian" rules={[{ required: true }]} initialValue="in">
                        <Space direction="horizontal">
                            <Button type={adjustForm.getFieldValue('type') === 'in' ? 'primary' : 'default'} onClick={() => adjustForm.setFieldValue('type', 'in')}>Masuk</Button>
                            <Button type={adjustForm.getFieldValue('type') === 'out' ? 'primary' : 'default'} onClick={() => adjustForm.setFieldValue('type', 'out')}>Keluar</Button>
                            <Button type={adjustForm.getFieldValue('type') === 'adjustment' ? 'primary' : 'default'} onClick={() => adjustForm.setFieldValue('type', 'adjustment')}>Audit</Button>
                        </Space>
                    </Form.Item>
                    <Form.Item name="quantity" label="Jumlah" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="reason" label="Alasan" rules={[{ required: true }]}>
                        <Input placeholder="Contoh: Barang Rusak, Salah Input" />
                    </Form.Item>
                </Form>
            </Modal>
        </MainLayout>
    );
};

export default InventoryIndex;
