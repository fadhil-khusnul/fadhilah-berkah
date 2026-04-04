import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
    ShoppingCartOutlined,
    InboxOutlined,
    AlertOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const { Title: AntTitle, Text } = Typography;

const Dashboard = ({ stats, chartData }) => {
    const data = {
        labels: chartData.map(d => d.date),
        datasets: [
            {
                label: 'Penjualan (Rp)',
                data: chartData.map(d => d.total),
                borderColor: '#00b96b',
                backgroundColor: 'rgba(0, 185, 107, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    };

    return (
        <AppLayout>
            <div className="mb-8">
                <AntTitle level={2} style={{ fontWeight: 800, letterSpacing: -1 }}>Dashboard Ringkasan</AntTitle>
                <Text type="secondary" className="text-sm">Pantau performa toko Fadhilah Berkah hari ini.</Text>
            </div>
            
            <Row gutter={[24, 24]}>
                <Col xs={ 24 } sm={ 12 } md={ 6 }>
                    <Card bordered={ false } className="shadow-sm">
                        <Statistic
                            title="Total Barang"
                            value={ stats.totalProducts }
                            prefix={ <InboxOutlined style={ { color: '#00b96b' } } /> }
                        />
                    </Card>
                </Col>
                <Col xs={ 24 } sm={ 12 } md={ 6 }>
                    <Card bordered={ false } className="shadow-sm">
                        <Statistic
                            title="Penjualan Hari Ini"
                            value={ stats.todaySales }
                            precision={ 0 }
                            prefix={ <ShoppingCartOutlined style={ { color: '#00b96b' } } /> }
                            suffix="IDR"
                        />
                    </Card>
                </Col>
                <Col xs={ 24 } sm={ 12 } md={ 6 }>
                    <Card bordered={ false } className="shadow-sm">
                        <Statistic
                            title="Transaksi Hari Ini"
                            value={ stats.totalTransactions }
                            prefix={ <LineChartOutlined style={ { color: '#00b96b' } } /> }
                        />
                    </Card>
                </Col>
                <Col xs={ 24 } sm={ 12 } md={ 6 }>
                    <Card bordered={ false } className="shadow-sm">
                        <Statistic
                            title="Stok Tipis (<5)"
                            value={ stats.lowStock }
                            valueStyle={ { color: stats.lowStock > 0 ? '#cf1322' : 'inherit' } }
                            prefix={ <AlertOutlined style={ { color: stats.lowStock > 0 ? '#cf1322' : '#00b96b' } } /> }
                        />
                    </Card>
                </Col>
            </Row>

            <div className="mt-12">
                <Card 
                    title={<Text strong className="text-lg">Grafik Penjualan 7 Hari Terakhir</Text>} 
                    bordered={false} 
                    className="shadow-premium rounded-3xl"
                    styles={{ body: { padding: '24px' } }}
                >
                    <div style={{ height: '350px' }}>
                        <Line options={{ ...options, maintainAspectRatio: false }} data={data} />
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
