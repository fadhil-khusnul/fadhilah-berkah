import React, { useState, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Row, Col, Card, List, Input, InputNumber, Button, Typography, Space, Divider, Radio, Modal, message, Badge } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, DeleteOutlined, CreditCardOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Title, Text } = Typography;

const PosIndex = ({ products }) => {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }, [products, search]);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) {
                message.error('Stok tidak mencukupi');
                return;
            }
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, q) => {
        if (q < 1) return;
        const product = products.find(p => p.id === id);
        if (q > product.stock) {
            message.error('Stok tidak mencukupi');
            return;
        }
        setCart(cart.map(item => item.id === id ? { ...item, quantity: q } : item));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.selling_price * item.quantity), 0);

    const handleCheckout = () => {
        router.post(route('pos.checkout'), {
            items: cart,
            total_amount: subtotal,
            payment_method: paymentMethod,
        }, {
            onSuccess: (page) => {
                setIsCheckoutModalOpen(false);
                setCart([]);
                message.success('Transaksi Berhasil!');
                // Open print dialog or show invoice info
                const invoiceId = page.props.flash.transaction_id;
                if (invoiceId) {
                    window.open(route('transactions.print', invoiceId), '_blank');
                }
            },
            onError: (err) => {
                message.error(err.message || 'Terjadi kesalahan');
            }
        });
    };

    return (
        <MainLayout>
            <Row gutter={ 24 }>
                {/* Product List */ }
                <Col xs={ 24 } lg={ 15 }>
                    <Card bordered={ false } className="shadow-sm">
                        <Input
                            prefix={ <SearchOutlined /> }
                            placeholder="Cari barang..."
                            className="mb-6 h-12"
                            onChange={ (e) => setSearch(e.target.value) }
                        />
                        <div style={ { height: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: 8 } }>
                            <Row gutter={ [24, 24] }>
                                { filteredProducts.map(product => (
                                    <Col xs={ 24 } sm={ 12 } md={ 8 } key={ product.id }>
                                        <Card
                                            hoverable
                                            className="h-full border border-gray-100 rounded-lg hover:border-green-500 transition-colors"
                                            onClick={ () => addToCart(product) }
                                        >
                                            <Title level={ 5 } className="mb-1 truncate">{ product.name }</Title>
                                            <Text type="secondary" className="block mb-2">Stok: { product.stock } { product.unit }</Text>
                                            <Text strong style={ { color: '#00b96b', fontSize: 16 } }>
                                                Rp { new Intl.NumberFormat('id-ID').format(product.selling_price) }
                                            </Text>
                                        </Card>
                                    </Col>
                                )) }
                            </Row>
                        </div>
                    </Card>
                </Col>

                {/* Cart */ }
                <Col xs={ 24 } lg={ 9 }>
                    <Card
                        title={
                            <div style={ { display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' } }>
                                <ShoppingCartOutlined style={ { fontSize: 20, color: '#10b981' } } />
                                <Text strong style={ { fontSize: 16 } }>Keranjang Belanja</Text>
                            </div>
                        }
                        bordered={ false }
                        className="shadow-sm flex flex-col h-full"
                        styles={ { body: { padding: 0 } } }
                    >
                        <div className="p-4" style={ { height: 'calc(100vh - 400px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' } }>
                            { cart.length === 0 ? (
                                <div style={ {
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#94a3b8',
                                    gap: 12
                                } }>
                                    <ShoppingCartOutlined style={ { fontSize: 48, opacity: 0.2 } } />
                                    <Text type="secondary">Keranjang Kosong</Text>
                                </div>
                            ) : (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={ cart }
                                    renderItem={ item => (
                                        <List.Item
                                            className="px-4 transition-colors"
                                            actions={ [
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={ <DeleteOutlined /> }
                                                    onClick={ () => removeFromCart(item.id) }
                                                    className="flex items-center justify-center"
                                                />
                                            ] }
                                        >
                                            <List.Item.Meta
                                                title={ <Text strong style={ { display: 'block', marginBottom: 4 } }>{ item.name }</Text> }
                                                description={
                                                    <div style={ { display: 'flex', flexDirection: 'column', gap: 8 } }>
                                                        <Text type="secondary" style={ { fontSize: 13 } }>
                                                            Rp { new Intl.NumberFormat('id-ID').format(item.selling_price) }
                                                        </Text>
                                                        <InputNumber
                                                            size="small"
                                                            min={ 1 }
                                                            max={ item.stock }
                                                            value={ item.quantity }
                                                            onChange={ (v) => updateQuantity(item.id, v) }
                                                            style={ { width: 60 } }
                                                        />
                                                    </div>
                                                }
                                            />
                                            <div style={ { textAlign: 'right', minWidth: 100 } }>
                                                <Text strong style={ { fontSize: 15, color: '#10b981' } }>
                                                    Rp { new Intl.NumberFormat('id-ID').format(item.selling_price * item.quantity) }
                                                </Text>
                                            </div>
                                        </List.Item>
                                    ) }
                                />
                            ) }
                        </div>

                        <div className="p-6 border-t rounded-b-xl mt-auto" style={ { borderTop: '1px solid rgba(0,0,0,0.05)' } }>
                            <div className="flex justify-between items-center mb-6">
                                <Text strong style={ { fontSize: 16, color: '#64748b' } }>TOTAL PEMBAYARAN</Text>
                                <Text strong style={ { fontSize: 28, color: '#10b981' } }>
                                    Rp { new Intl.NumberFormat('id-ID').format(subtotal) }
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                block
                                disabled={ cart.length === 0 }
                                onClick={ () => setIsCheckoutModalOpen(true) }
                                style={ {
                                    height: 52,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    borderRadius: 12,
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                } }
                            >
                                <MoneyCollectOutlined style={ { fontSize: 20 } } /> Proses Checkout
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Checkout Modal */ }
            <Modal
                title="Selesaikan Pembayaran"
                open={ isCheckoutModalOpen }
                onCancel={ () => setIsCheckoutModalOpen(false) }
                footer={ null }
            >
                <div className="py-4">
                    <div className="mb-6 text-center">
                        <Text type="secondary">Total yang harus dibayar:</Text>
                        <Title level={ 2 } style={ { marginTop: 8, color: '#00b96b' } }>
                            Rp { new Intl.NumberFormat('id-ID').format(subtotal) }
                        </Title>
                    </div>

                    <Divider orientation="left">Metode Pembayaran</Divider>
                    <Radio.Group
                        onChange={ (e) => setPaymentMethod(e.target.value) }
                        value={ paymentMethod }
                        className="w-full"
                    >
                        <Row gutter={ [16, 16] }>
                            <Col span={ 12 }>
                                <Radio.Button value="cash" className="w-full h-16" style={ { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 } }>
                                    <MoneyCollectOutlined style={ { fontSize: 18 } } /> <Text strong>Tunai</Text>
                                </Radio.Button>
                            </Col>
                            <Col span={ 12 }>
                                <Radio.Button value="transfer" className="w-full h-16" style={ { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 } }>
                                    <CreditCardOutlined style={ { fontSize: 18 } } /> <Text strong>Transfer</Text>
                                </Radio.Button>
                            </Col>
                        </Row>
                    </Radio.Group>

                    <div className="mt-8 flex gap-3">
                        <Button block size="large" style={ { height: 48, borderRadius: 10 } } onClick={ () => setIsCheckoutModalOpen(false) }>Batal</Button>
                        <Button block size="large" type="primary" style={ { height: 48, borderRadius: 10, fontWeight: 700 } } onClick={ handleCheckout }>Bayar Sekarang</Button>
                    </div>
                </div>
            </Modal>
        </MainLayout>
    );
};

export default PosIndex;
