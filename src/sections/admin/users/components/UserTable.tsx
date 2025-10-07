import { Table, Button, Space, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { User } from '@/store/user/crud';
import { useEffect, useState } from 'react';
import '@/assets/style/UserTable.scss';

interface UserTableProps {
    users: User[];
    loading: boolean;
    onEdit: (record: User) => void;
    onDelete: (record: User) => void;
    onSort: (field: string) => void;
    sortField: string;
    SortDir: number;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function UserTable({
    users,
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
}: UserTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'red';
            case 'user':
                return 'green';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const columns: ColumnsType<User> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Username</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'username' ? 'active' : ''} ${sortField === 'username' && SortDir === 1 ? 'asc' : sortField === 'username' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'username' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('username')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'username',
            key: 'username',
            className: sortField === 'username' ? 'sorted-column' : '',
            render: (username) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <span>{username}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <Tooltip title={email}>
                    <span>{email.length > 25 ? `${email.substring(0, 25)}...` : email}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={getRoleColor(role)}>
                    {role?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (phoneNumber) => phoneNumber || '-',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive === 'true' || isActive === true ? 'green' : 'red'}>
                    {isActive === 'true' || isActive === true ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Created Time</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'createdTime' ? 'active' : ''} ${sortField === 'createdTime' && SortDir === 1 ? 'asc' : sortField === 'createdTime' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'createdTime' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('createdTime')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'createdTime',
            key: 'createdTime',
            className: sortField === 'createdTime' ? 'sorted-column' : '',
            render: (date) => formatDate(date),
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
        <div className="user-table" style={{
            overflowX: 'auto',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
        }}>
            <Table
                columns={columns}
                dataSource={users}
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
