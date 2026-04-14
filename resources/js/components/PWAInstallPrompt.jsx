import React, { useEffect, useState } from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { DownloadOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Show the install button or modal
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA: User choice outcome: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    return (
        <Modal
            title={null}
            open={isVisible}
            onCancel={handleCancel}
            footer={null}
            centered
            closable={true}
            maskClosable={true}
            width={340}
            styles={{
                body: { padding: '24px 16px' }
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ 
                    width: 64, 
                    height: 64, 
                    margin: '0 auto 16px', 
                    borderRadius: 16, 
                    background: '#00b96b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <AppstoreOutlined style={{ fontSize: 32, color: '#fff' }} />
                </div>
                
                <Title level={4} style={{ marginBottom: 8 }}>Install Fadhilah Berkah</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                    Install aplikasi ini di HP Anda untuk akses lebih cepat dan mudah tanpa melalui browser.
                </Text>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<DownloadOutlined />} 
                        onClick={handleInstall}
                        block
                        style={{ background: '#00b96b', borderColor: '#00b96b' }}
                    >
                        Install Sekarang
                    </Button>
                    <Button type="text" onClick={handleCancel} block>
                        Nanti Saja
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default PWAInstallPrompt;
