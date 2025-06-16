'use client'
import { Layout, ConfigProvider } from 'antd';
import AdminSidebar from '@/components/admin/AdminSidebar';
import theme from '../../../config/themeConfig';

const { Content } = Layout;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConfigProvider theme={theme}>
            <Layout style={{ minHeight: '100vh' }}>
                <AdminSidebar />
                <Layout style={{ marginLeft: 250 }}>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
