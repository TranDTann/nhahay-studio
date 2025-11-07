import { Table, Button, Space, Image } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Advertisement } from '@/store/advertisement/crud';
import { useEffect, useState } from 'react';
import '@/assets/style/AdvertisementTable.scss';

interface AdvertisementTableProps {
    advertisements: Advertisement[];
    loading: boolean;
    onEdit: (record: Advertisement) => void;
    onDelete: (record: Advertisement) => void;
    onSort: (field: string) => void;
    sortField: string;
    SortDir: number;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function AdvertisementTable({
    advertisements,
    loading,
    onEdit,
    onDelete,
    onSort,
    sortField,
    SortDir,
    total = 0,
    currentPage = 1,
    pageSize = 10,
    onPageChange
}: AdvertisementTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const columns: ColumnsType<Advertisement> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Title</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'title' ? 'active' : ''} ${sortField === 'title' && SortDir === 1 ? 'asc' : sortField === 'title' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'title' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('title')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'title',
            key: 'title',
            className: sortField === 'title' ? 'sorted-column' : '',
        },
        {
            title: 'Position',
            dataIndex: 'positionType',
            key: 'positionType',
            render: (positionType) => positionType || '-',
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl) => imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Advertisement"
                    width={60}
                    height={40}
                    style={{ objectFit: 'cover' }}
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
            title: 'Click Amount',
            dataIndex: 'clickAdvertisement',
            key: 'clickAdvertisement',
            render: (amount) => amount !== undefined && amount !== null ? amount.toLocaleString() : '0',
            align: 'center',
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Created Date</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'createdAt' ? 'active' : ''} ${sortField === 'createdAt' && SortDir === 1 ? 'asc' : sortField === 'createdAt' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'createdAt' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('createdAt')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: sortField === 'createdAt' ? 'sorted-column' : '',
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
        <div style={{
            overflowX: 'auto',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
        }}>
            <Table
                columns={columns}
                dataSource={advertisements}
                rowKey="id"
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: currentPage,
                    pageSize: 10,
                    total: total,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                    onChange: onPageChange,
                }}
            />
        </div>
    );
} 