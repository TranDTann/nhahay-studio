import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Tag } from '@/store/tags/crud';
import { useEffect, useState } from 'react';
import '@/assets/style/TagTable.scss';

interface TagTableProps {
    tags: Tag[];
    loading: boolean;
    onEdit: (record: Tag) => void;
    onDelete: (record: Tag) => void;
    onSort: (field: string) => void;
    sortField: string;
    SortDir: number;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function TagTable({
    tags,
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
}: TagTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const columns: ColumnsType<Tag> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Name</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'name' ? 'active' : ''} ${sortField === 'name' && SortDir === 1 ? 'asc' : sortField === 'name' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'name' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('name')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
            className: sortField === 'name' ? 'sorted-column' : '',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => description || '-',
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
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
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
                dataSource={tags}
                rowKey="id"
                loading={loading}
                scroll={{ x: 'max-content' }}
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
        </div>
    );
}
