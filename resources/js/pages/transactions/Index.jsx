import React from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Table, Button, Typography, Space, Tag, Input } from 'antd';
import { PrinterOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Title, Text } = Typography;

const TransactionIndex = ({ transactions }) => {
    const columns = [
        {
            title: 'No. Invoice',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Tanggal',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString('id-ID'),
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (total) => `Rp ${new Intl.NumberFormat('id-ID').format(total)}`,
        },
        {
            title: 'Metode',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => <Tag color="blue">{method.toUpperCase()}</Tag>,
        },
        {
            title: 'Kasir',
            dataIndex: 'cashier',
            key: 'cashier',
            render: (cashier) => cashier?.name,
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        icon={<PrinterOutlined />} 
                        onClick={() => window.open(route('transactions.print', record.id), '_blank')}
                    >
                        Cetak
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <div className="mb-6 flex justify-between items-center sm:flex-row flex-col gap-4">
                <Title level={4}>Riwayat Transaksi</Title>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Cari No. Invoice..."
                    allowClear
                    onPressEnter={(e) => router.get(route('transactions.index'), { search: e.target.value }, { preserveState: true })}
                    style={{ width: 250 }}
                />
            </div>

            <Table 
                columns={columns} 
                dataSource={transactions.data} 
                rowKey="id"
                scroll={{ x: true }}
                pagination={{
                    current: transactions.current_page,
                    pageSize: transactions.per_page,
                    total: transactions.total,
                    onChange: (page) => router.get(route('transactions.index'), { page }),
                }}
            />
        </AppLayout>
    );
};

export default TransactionIndex;
