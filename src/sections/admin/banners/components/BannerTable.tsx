import { Table, Button, Space, Image, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Banner } from '@/store/banner/crud';
import { useEffect, useState } from 'react';

interface BannerTableProps {
    banners: Banner[];
    loading: boolean;
    onEdit: (record: Banner) => void;
    onDelete: (record: Banner) => void;
    onSort: (field: string) => void;
    sortField: string;
    sortDirection: number;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function BannerTable({
    banners,
    loading,
    onEdit,
    onDelete,
    onSort,
    sortField,
    sortDirection,
    total = 0,
    currentPage = 1,
    pageSize = 10,
    onPageChange
}: BannerTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const columns: ColumnsType<Banner> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Title</span>
                    <Button
                        type="text"
                        size="small"
                        icon={sortField === 'title' ? (sortDirection === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('title')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: (position) => position || '-',
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl) => imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Banner"
                    width={80}
                    height={50}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                />
            ) : '-',
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (link) => link ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                    {link.length > 30 ? `${link.substring(0, 30)}...` : link}
                </a>
            ) : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Created Date</span>
                    <Button
                        type="text"
                        size="small"
                        icon={sortField === 'createdAt' ? (sortDirection === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('createdAt')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        {!isMobile && 'Edit'}
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record)}
                    >
                        {!isMobile && 'Delete'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={banners}
            rowKey="id"
            loading={loading}
            pagination={{
                current: currentPage,
                pageSize: 10,
                total: total,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: onPageChange,
            }}
        />
    );
} 