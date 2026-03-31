import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Table, Typography, Tag, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Title, Text } = Typography;

const InventoryHistory = ({ product, history }) => {
    const columns = [
        {
            title: 'Waktu',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString('id-ID'),
        },
        {
            title: 'Tipe',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const colors = { in: 'green', out: 'volcano', adjustment: 'blue' };
                const labels = { in: 'Masuk', out: 'Keluar', adjustment: 'Penyesuaian' };
                return <Tag color={colors[type]}>{labels[type].toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Jumlah',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (q, record) => (
                <Text strong style={{ color: record.type === 'out' ? '#f5222d' : '#52c41a' }}>
                    {record.type === 'out' ? '-' : '+'}{q}
                </Text>
            ),
        },
        {
            title: 'Alasan',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Petugas',
            dataIndex: 'user',
            key: 'user',
            render: (user) => user?.name,
        },
    ];

    return (
        <MainLayout>
            <div className="mb-6 flex items-center gap-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => router.get(route('inventory.index'))} />
                <Title level={4} style={{ margin: 0 }}>Riwayat Stok: {product.name}</Title>
            </div>

            <Table 
                columns={columns} 
                dataSource={history} 
                rowKey="id"
                scroll={{ x: true }}
            />
        </MainLayout>
    );
};

export default InventoryHistory;
