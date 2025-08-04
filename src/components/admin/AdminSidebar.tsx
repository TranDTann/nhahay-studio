import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    TagsOutlined,
    NotificationOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/assets/style/AdminSidebar.scss';

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
        icon: <FolderOutlined />,
        label: <Link href="/admin/categories">Categories</Link>,
    },
    {
        key: '/admin/advertisement',
        icon: <NotificationOutlined />,
        label: <Link href="/admin/advertisement">Advertisement</Link>,
    },
    {
        key: '/admin/banners',
        icon: <NotificationOutlined />,
        label: <Link href="/admin/banners">Banners</Link>,
    },
];

interface AdminSidebarProps {
    isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
    const pathname = usePathname();

    return (
        <Sider
            width={250}
            className={`admin-sidebar__container ${isOpen ? 'open' : ''}`}
        >
            <div className="admin-sidebar__header">
                Admin Panel
            </div>
            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                className="admin-sidebar__menu"
                items={menuItems}
            />
        </Sider>
    );
};

export default AdminSidebar;