'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/user/userStore';
import { User } from '@/store/user/crud';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';

export default function UsersList() {
    const {
        users,
        loading,
        listLoading,
        error,
        total,
        currentPage,
        pageSize,
        getUsers,
        setFilters,
        setPage,
        updateUser,
        deleteUser
    } = useUserStore();

    const [searchText, setSearchText] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [SortDir, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUsers();
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchData();
    }, [getUsers]);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPendingSearch(e.target.value);
    };

    const handleSearch = () => {
        setSearchText(pendingSearch);
        const filters = {
            search: pendingSearch,
            sort: sortField,
            SortDir: SortDir
        };
        setFilters(filters, true);
    };

    const handleSearchIconClick = () => {
        handleSearch();
    };

    const handleSort = (field: string) => {
        const newSortDirection = field === sortField ? (SortDir === 0 ? 1 : 0) : 0;
        setSortField(field);
        setSortDirection(newSortDirection);

        const filters = {
            search: searchText,
            sort: field,
            SortDir: newSortDirection
        };
        setFilters(filters);
    };

    const handleEdit = (record: User) => {
        setSelectedUser(record);
        setEditModalVisible(true);
    };

    const handleDelete = (record: User) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteUser(record.id!);
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (data: Partial<User>) => {
        setFormLoading(true);
        try {
            await updateUser(data);
            setEditModalVisible(false);
            setSelectedUser(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    if (loading && users.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="users-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>User Management</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input
                                placeholder="Search users by username, email..."
                                prefix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleSearchIconClick} />}
                                value={pendingSearch}
                                onChange={handleSearchInput}
                                style={{ width: '100%' }}
                                onPressEnter={handleSearch}
                            />
                        </Col>
                    </Row>
                </Space>
            </div>

            <UserTable
                users={users}
                loading={listLoading || loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSort={handleSort}
                sortField={sortField}
                SortDir={SortDir}
                total={total}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />

            {editModalVisible && (
                <UserForm
                    visible={editModalVisible}
                    onCancel={() => {
                        setEditModalVisible(false);
                        setSelectedUser(null);
                    }}
                    onSubmit={handleFormSubmit}
                    initialValues={selectedUser}
                    title="Edit User"
                    loading={formLoading}
                />
            )}
        </div>
    );
}
