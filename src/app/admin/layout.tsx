'use client'
import { Layout, ConfigProvider } from 'antd';
import AdminSidebar from '@/components/admin/AdminSidebar';
import theme from '../../../config/themeConfig';
import { useState, useEffect } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { ConfigProvider as AppConfigProvider } from '@/contexts/ConfigContext';

const { Content } = Layout;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 1024);
            if (window.innerWidth > 1024) {
                setIsSidebarOpen(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <AppConfigProvider>
            <ConfigProvider theme={theme}>
                <Layout style={{ minHeight: '100vh' }}>
                    <button
                        className="admin-sidebar__toggle"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <MenuOutlined />
                    </button>

                    <div
                        className={`admin-sidebar__overlay ${isSidebarOpen ? 'open' : ''}`}
                        onClick={closeSidebar}
                    />
                    {
                        isSidebarOpen && (
                            <AdminSidebar isOpen={isSidebarOpen} />
                        )
                    }


                    <Layout className="admin-content">
                        <Content style={{ padding: '24px 8px', background: '#fff' }}>
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </AppConfigProvider>
    );
}
