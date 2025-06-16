import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    TagsOutlined,
    NotificationOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;

const menuItems = [
    {
        key: '/admin',
        icon: <HomeOutlined />,
        label: <Link href="/admin">Home</Link>,
    },
    {
        key: '/admin/articles',
        icon: <FileTextOutlined />,
        label: <Link href="/admin/articles">Articles</Link>,
    },
    {
        key: '/admin/tags',
        icon: <TagsOutlined />,
        label: <Link href="/admin/tags">Tags</Link>,
    },
    {
        key: '/admin/categories',
        icon: <TagsOutlined />,
        label: <Link href="/admin/categories">Categories</Link>,
    },
    {
        key: '/admin/advertisement',
        icon: <NotificationOutlined />,
        label: <Link href="/admin/advertisement">Advertisement</Link>,
    },
];

const AdminSidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <Sider
            width={250}
            style={{
                background: '#fff',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div
                style={{
                    height: '64px',
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                Admin Panel
            </div>
            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
                items={menuItems}
            />
        </Sider>
    );
};

export default AdminSidebar;