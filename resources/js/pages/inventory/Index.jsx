import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Table, Button, Input, Modal, Form, InputNumber, Space, Typography, Tag, Popconfirm, message, Upload, Switch, Radio } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, SwapOutlined, UploadOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const { Title, Text } = Typography;
const { Search, TextArea } = Input;

const InventoryIndex = ({ products, filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [adjustingProduct, setAdjustingProduct] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'
    const [form] = Form.useForm();
    const [adjustForm] = Form.useForm();

    const columns = [
        {
            title: 'Foto',
            dataIndex: 'image_url',
            key: 'image',
            width: 80,
            render: (url) => <img src={ url } style={ { width: 50, height: 50, objectFit: 'cover', borderRadius: '8px' } } />,
        },
        {
            title: 'Nama Barang',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Text strong>{ text }</Text>
                    { record.is_featured && <StarFilled style={ { color: '#f59e0b' } } /> }
                </Space>
            ),
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
            render: (stock, record) => (
                <Tag color={ stock < 5 ? 'volcano' : 'green' }>
                    { stock } { record.unit }
                </Tag>
            ),
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={ <SwapOutlined /> }
                        onClick={ () => {
                            setAdjustingProduct(record);
                            setIsAdjustModalOpen(true);
                        } }
                    >
                        Stok
                    </Button>
                    <Button
                        icon={ <EditOutlined /> }
                        onClick={ () => {
                            setEditingProduct(record);
                            // Pre-populate imageSource based on current image type
                            const isUrl = record.image && record.image.startsWith('http');
                            setImageSource(isUrl ? 'url' : 'upload');

                            // Pre-populate fileList with current image_url if not a URL
                            setFileList(record.image && !isUrl ? [
                                {
                                    uid: '-1',
                                    name: 'Current Image',
                                    status: 'done',
                                    url: record.image_url,
                                    thumbUrl: record.image_url,
                                }
                            ] : []);

                            form.setFieldsValue({
                                ...record,
                                image: isUrl ? record.image : undefined,
                                is_featured: !!record.is_featured
                            });

                            // Use a small timeout to ensure form state is fully internalized 
                            // before the and Design modal renders the inputs
                            setTimeout(() => {
                                setIsModalOpen(true);
                            }, 50);
                        } }
                    />
                    <Popconfirm
                        title="Hapus barang?"
                        onConfirm={ () => router.delete(route('inventory.destroy', record.id)) }
                        okText="Ya"
                        cancelText="Tidak"
                    >
                        <Button danger icon={ <DeleteOutlined /> } />
                    </Popconfirm>
                    <Button
                        icon={ <HistoryOutlined /> }
                        onClick={ () => router.get(route('inventory.history', record.id)) }
                    />
                </Space>
            ),
        },
    ];

    const number_format = (val) => new Intl.NumberFormat('id-ID').format(val);

    const handleSave = (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== undefined && values[key] !== null) {
                if (key === 'image') {
                    if (imageSource === 'upload') {
                        // Only append if a new file was actually selected (originFileObj exists)
                        if (fileList[0]?.originFileObj) {
                            formData.append('image', fileList[0].originFileObj);
                        }
                    } else {
                        // URL mode: Append the string from the input
                        formData.append('image', values[key]);
                    }
                } else if (key === 'is_featured') {
                    formData.append('is_featured', values[key] ? 1 : 0);
                } else {
                    formData.append(key, values[key]);
                }
            }
        });

        if (editingProduct) {
            formData.append('_method', 'PUT');
            router.post(route('inventory.update_product', editingProduct.id), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    setFileList([]);
                    form.resetFields();
                    message.success('Barang diperbarui');
                },
            });
        } else {
            router.post(route('inventory.store'), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setFileList([]);
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
        <AppLayout>
            <div className="mb-6 flex justify-between items-center sm:flex-row flex-col gap-4">
                <Title level={ 4 }>Manajemen Inventaris</Title>
                <div className="flex gap-4 sm:flex-row flex-col w-full sm:w-auto">
                    <Search
                        placeholder="Cari barang..."
                        allowClear
                        onSearch={ (v) => router.get(route('inventory.index'), { search: v }, { preserveState: true }) }
                        style={ { width: 250 } }
                        defaultValue={ filters.search }
                    />
                    <Button type="primary" icon={ <PlusOutlined /> } onClick={ () => {
                        setEditingProduct(null);
                        setImageSource('upload');
                        setFileList([]);
                        form.resetFields();
                        setIsModalOpen(true);
                    } }>
                        Tambah Barang
                    </Button>
                </div>
            </div>

            <Table
                columns={ columns }
                dataSource={ products.data }
                rowKey="id"
                scroll={ { x: 'max-content' } }
                pagination={ {
                    current: products.current_page,
                    pageSize: products.per_page,
                    total: products.total,
                    onChange: (page) => router.get(route('inventory.index'), { page, search: filters.search }),
                } }
            />

            {/* Add/Edit Modal */ }
            <Modal
                title={ editingProduct ? 'Edit Barang' : 'Tambah Barang' }
                open={ isModalOpen }
                onCancel={ () => setIsModalOpen(false) }
                onOk={ () => form.submit() }
            >
                <Form form={ form } layout="vertical" onFinish={ handleSave }>
                    <Form.Item label="Metode Gambar">
                        <Radio.Group
                            value={ imageSource }
                            onChange={ (e) => {
                                const mode = e.target.value;
                                setImageSource(mode);
                                // Clear image field when switching modes to prevent accidental persistence
                                form.setFieldValue('image', undefined);
                                if (mode === 'upload') setFileList([]);
                            } }
                            buttonStyle="solid"
                        >
                            <Radio.Button value="upload">Upload File</Radio.Button>
                            <Radio.Button value="url">URL Gambar</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    { imageSource === 'upload' ? (
                        <Form.Item name="image" label="Foto Produk">
                            <Upload
                                listType="picture-card"
                                fileList={ fileList }
                                onPreview={ () => { } }
                                onChange={ ({ fileList: newFileList }) => setFileList(newFileList) }
                                beforeUpload={ () => false }
                                maxCount={ 1 }
                            >
                                { fileList.length >= 1 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={ { marginTop: 8 } }>Upload</div>
                                    </div>
                                ) }
                            </Upload>
                        </Form.Item>
                    ) : (
                        <Form.Item name="image" label="URL Foto Produk" rules={ [{ type: 'url', message: 'Masukkan URL yang valid' }] }>
                            <Input placeholder="https://example.com/image.jpg" prefix={ <UploadOutlined /> } />
                        </Form.Item>
                    ) }
                    <Form.Item name="name" label="Nama Barang" rules={ [{ required: true }] }>
                        <Input />
                    </Form.Item>
                    <Form.Item name="selling_price" label="Harga Jual (Rp)" rules={ [{ required: true }] }>
                        <InputNumber style={ { width: '100%' } } />
                    </Form.Item>
                    <Form.Item name="unit" label="Satuan" rules={ [{ required: true }] } initialValue="pcs">
                        <Input />
                    </Form.Item>
                    { !editingProduct && (
                        <Form.Item name="stock" label="Stok Awal" rules={ [{ required: true }] }>
                            <InputNumber style={ { width: '100%' } } />
                        </Form.Item>
                    ) }
                    <Form.Item name="description" label="Deskripsi">
                        <TextArea rows={ 4 } placeholder="Masukkan deskripsi produk..." />
                    </Form.Item>
                    <Form.Item name="is_featured" valuePropName="checked" label="Produk Unggulan (Carousel)">
                        <Switch checkedChildren="YA" unCheckedChildren="TIDAK" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Adjust Modal */ }
            <Modal
                title={ `Sesuaikan Stok: ${adjustingProduct?.name}` }
                open={ isAdjustModalOpen }
                onCancel={ () => setIsAdjustModalOpen(false) }
                onOk={ () => adjustForm.submit() }
            >
                <Form form={ adjustForm } layout="vertical" onFinish={ handleAdjust }>
                    <Form.Item name="type" label="Tipe Penyesuaian" rules={ [{ required: true }] } initialValue="in">
                        <Space direction="horizontal">
                            <Button type={ adjustForm.getFieldValue('type') === 'in' ? 'primary' : 'default' } onClick={ () => adjustForm.setFieldValue('type', 'in') }>Masuk</Button>
                            <Button type={ adjustForm.getFieldValue('type') === 'out' ? 'primary' : 'default' } onClick={ () => adjustForm.setFieldValue('type', 'out') }>Keluar</Button>
                            <Button type={ adjustForm.getFieldValue('type') === 'adjustment' ? 'primary' : 'default' } onClick={ () => adjustForm.setFieldValue('type', 'adjustment') }>Audit</Button>
                        </Space>
                    </Form.Item>
                    <Form.Item name="quantity" label="Jumlah" rules={ [{ required: true }] }>
                        <InputNumber style={ { width: '100%' } } />
                    </Form.Item>
                    <Form.Item name="reason" label="Alasan" rules={ [{ required: true }] }>
                        <Input placeholder="Contoh: Barang Rusak, Salah Input" />
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>
    );
};

export default InventoryIndex;
