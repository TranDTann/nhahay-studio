import { Table, Button, Space, Image } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Category } from '@/store/categories/crud';
import { useEffect, useState } from 'react';
import '@/assets/style/CategoryTable.scss';

interface CategoryTableProps {
    categories: Category[];
    loading: boolean;
    onEdit: (record: Category) => void;
    onDelete: (record: Category) => void;
    onSort: (field: string) => void;
    sortField: string;
    SortDir: number;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function CategoryTable({
    categories,
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
}: CategoryTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const columns: ColumnsType<Category> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Name</span>
                    <Button
                        type="text"
                        size="small"
                        icon={sortField === 'name' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('name')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thumbnail',
            dataIndex: 'urlThumbnail',
            key: 'urlThumbnail',
            render: (urlThumbnail) => urlThumbnail ? (
                <div className="thumbnail-cell">
                    <Image
                        src={urlThumbnail}
                        alt="Category thumbnail"
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                </div>
            ) : (
                <div className="thumbnail-cell">
                    <div className="no-image-placeholder">
                        No Image
                    </div>
                </div>
            ),
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
                        icon={sortField === 'createdAt' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('createdAt')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="action-buttons">
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
                </div>
            ),
        },
    ];

    return (
        <div className="category-table" style={{
            overflowX: 'auto',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
        }}>
            <Table
                columns={columns}
                dataSource={categories}
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