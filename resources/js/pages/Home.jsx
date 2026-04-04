import React, { useState } from 'react';
import { Layout, Carousel, Card, Row, Col, Typography, Button, Modal, Tag, Badge, Space } from 'antd';
import { ShoppingCartOutlined, InfoCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import HomeLayout from '../layouts/HomeLayout';
import { Link, Head } from '@inertiajs/react';

const { Title, Text, Paragraph } = Typography;

const Home = ({ featuredProducts, allProducts }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showDetail = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <HomeLayout>
            <Head title="Selamat Datang" />

            {/* Hero Section / Carousel */ }
            <div style={ { margin: 0, position: 'relative' } }>
                <Carousel autoplay effect="fade" dotPosition="bottom">
                    { featuredProducts.map((product) => (
                        <div key={ product.id }>
                            <div style={ {
                                height: '500px',
                                color: '#fff',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${product.image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0 20px'
                            } }>
                                <div style={ { paddingTop: '100px' } }>
                                    <Tag color="gold" style={ { marginBottom: 16, fontSize: '14px', padding: '4px 12px' } }>PRODUK UNGGULAN</Tag>
                                    <Title level={ 1 } style={ { color: '#fff', fontSize: '48px', marginBottom: 16, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } }>
                                        { product.name }
                                    </Title>
                                    <Paragraph style={ { color: 'rgba(255,255,255,0.9)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' } }>
                                        { product.description || 'Kualitas terbaik untuk kenyamanan Anda sehari-hari.' }
                                    </Paragraph>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={ <ShoppingCartOutlined /> }
                                        onClick={ () => showDetail(product) }
                                        style={ { height: '50px', padding: '0 32px', borderRadius: '25px', fontSize: '16px', fontWeight: 600 } }
                                    >
                                        Lihat Selengkapnya
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )) }
                </Carousel>
            </div>

            <div style={ { maxWidth: 1200, margin: '0 auto', padding: '0 20px' } }>
                {/* Our Products Section */ }
                <div style={ { textAlign: 'center', marginBottom: 48, marginTop: 48 } }>
                    <Title level={ 2 } style={ { marginBottom: 12 } }>Koleksi Produk Kami</Title>
                    <div style={ { width: 60, height: 4, background: '#10b981', margin: '0 auto 16px auto', borderRadius: 2 } } />
                    <Text type="secondary" style={ { fontSize: 16 } }>Temukan berbagai pilihan busana berkualitas tinggi dengan harga terjangkau.</Text>
                </div>

                <Row gutter={ [24, 32] }>
                    { allProducts.map((product) => (
                        <Col xs={ 24 } sm={ 12 } md={ 8 } lg={ 6 } key={ product.id }>
                            <Badge.Ribbon text={ product.is_featured ? "Featured" : "" } color="#f59e0b" hidden={ !product.is_featured }>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={ { height: 250, overflow: 'hidden', position: 'relative' } }>
                                            <img
                                                alt={ product.name }
                                                src={ product.image_url }
                                                style={ { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' } }
                                                className="product-card-img"
                                            />
                                            <div style={ {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0,0,0,0.1)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            } } className="product-card-overlay">
                                                <Button shape="circle" icon={ <InfoCircleOutlined /> } size="large" onClick={ () => showDetail(product) } />
                                            </div>
                                        </div>
                                    }
                                    actions={ [
                                        <Button type="link" onClick={ () => showDetail(product) }>
                                            Detail Produk <ArrowRightOutlined />
                                        </Button>
                                    ] }
                                    styles={ { body: { padding: '16px' } } }
                                >
                                    <div style={ { marginBottom: 8 } }>
                                        <Text type="secondary" style={ { fontSize: 12, textTransform: 'uppercase' } }>{ product.unit }</Text>
                                        <Title level={ 5 } style={ { margin: '4px 0', height: '48px', overflow: 'hidden' } }>{ product.name }</Title>
                                    </div>
                                    <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
                                        <Text strong style={ { color: '#10b981', fontSize: 18 } }>{ formatCurrency(product.selling_price) }</Text>
                                        <Tag color={ product.stock > 0 ? 'green' : 'red' }>
                                            { product.stock > 0 ? `Stok: ${product.stock}` : 'Habis' }
                                        </Tag>
                                    </div>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    )) }
                </Row>
            </div>

            {/* Product Detail Modal */ }
            <Modal
                title={ null }
                open={ isModalOpen }
                onCancel={ () => setIsModalOpen(false) }
                footer={ null }
                width={ 800 }
                styles={ { body: { padding: 0 } } }
            >
                { selectedProduct && (
                    <Row>
                        <Col xs={ 24 } md={ 12 }>
                            <img
                                src={ selectedProduct.image_url }
                                style={ { width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 } }
                                alt={ selectedProduct.name }
                            />
                        </Col>
                        <Col xs={ 24 } md={ 12 } style={ { padding: 32 } }>
                            <Space direction="vertical" size="large" style={ { width: '100%' } }>
                                <div>
                                    { !!selectedProduct.is_featured && <Tag color="gold" style={ { marginBottom: 8 } }>Featured Product</Tag> }
                                    <Title level={ 2 } style={ { marginTop: 0 } }>{ selectedProduct.name }</Title>
                                    <Text type="secondary">Kategori: { selectedProduct.unit }</Text>
                                </div>

                                <Title level={ 3 } style={ { color: '#10b981', marginTop: 16 } }>
                                    { formatCurrency(selectedProduct.selling_price) }
                                </Title>

                                <div>
                                    <Title level={ 5 }>Deskripsi Produk</Title>
                                    <Paragraph type="secondary" style={ { fontSize: '15px', lineHeight: '1.8' } }>
                                        { selectedProduct.description || 'Tidak ada deskripsi untuk produk ini.' }
                                    </Paragraph>
                                </div>

                                <div style={ { padding: '20px', borderRadius: 12 } }>
                                    <Row gutter={ 24 }>
                                        <Col span={ 12 }>
                                            <div style={ { display: 'flex', flexDirection: 'column' } }>
                                                <Text type="secondary" style={ { fontSize: 13, marginBottom: 4 } }>Status Stok</Text>
                                                <Space>
                                                    <div style={ { width: 8, height: 8, borderRadius: '50%', background: selectedProduct.stock > 0 ? '#10b981' : '#ef4444' } } />
                                                    <Text strong style={ { color: selectedProduct.stock > 0 ? '#e2e8f0' : '#991b1b' } }>
                                                        { selectedProduct.stock > 0 ? 'Tersedia' : 'Habis' }
                                                    </Text>
                                                </Space>
                                            </div>
                                        </Col>
                                        <Col span={ 12 } style={ { borderLeft: '1px solid #e2e8f0' } }>
                                            <div style={ { display: 'flex', flexDirection: 'column' } }>
                                                <Text type="secondary" style={ { fontSize: 13, marginBottom: 4 } }>Jumlah Stok</Text>
                                                <Text strong style={ { fontSize: 16 } }>
                                                    { selectedProduct.stock } { selectedProduct.unit }
                                                </Text>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    style={ { height: 55, borderRadius: 12, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' } }
                                    icon={ <ShoppingCartOutlined style={ { fontSize: 20 } } /> }
                                    onClick={ () => window.open(`https://wa.me/6287815778723?text=Halo Admin, saya tertarik dengan produk ${selectedProduct.name}`, '_blank') }
                                >
                                    Hubungi Admin (WhatsApp)
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                ) }
            </Modal>

            <style dangerouslySetInnerHTML={ {
                __html: `
                .product-card-img:hover { transform: scale(1.05); }
                .ant-card:hover .product-card-overlay { opacity: 1 !important; }
            `} } />
        </HomeLayout>
    );
};

export default Home;
