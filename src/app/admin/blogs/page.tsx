'use client'
import FormBlog from '@/sections/admin/articles/FormBlog';
import { Typography } from 'antd';

const { Title } = Typography;

export default function AdminBlogsPage() {
    return (
        <div>
            <Title level={2}>Blog Management</Title>
            <FormBlog />
        </div>
    );
} 