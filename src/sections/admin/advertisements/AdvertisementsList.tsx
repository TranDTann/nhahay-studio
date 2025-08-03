'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAdvertisementStore } from '@/store/advertisement/advertisementStore';
import { Advertisement } from '@/store/advertisement/crud';
import { categoryCrud, Category } from '@/store/categories/crud';
import AdvertisementTable from './components/AdvertisementTable';
import AdvertisementForm from './components/AdvertisementForm';

export default function AdvertisementsList() {
    const {
        advertisements,
        loading,
        listLoading,
        error,
        total,
        currentPage,
        pageSize,
        getAdvertisements,
        setFilters,
        setPage,
        createAdvertisement,
        updateAdvertisement,
        deleteAdvertisement
    } = useAdvertisementStore();

    const [searchText, setSearchText] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [SortDir, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAdvertisements();
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchData();
    }, [getAdvertisements]);

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

    const handleEdit = (record: Advertisement) => {
        setSelectedAdvertisement(record);
        setEditModalVisible(true);
    };

    const handleDelete = (record: Advertisement) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this advertisement?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteAdvertisement(record.id!);
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (data: Advertisement) => {
        setFormLoading(true);
        try {
            if (selectedAdvertisement) {
                await updateAdvertisement({ ...data, id: selectedAdvertisement.id });
            } else {
                await createAdvertisement(data);
            }
            setEditModalVisible(false);
            setSelectedAdvertisement(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    if (loading && advertisements.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="advertisements-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>Advertisement Management</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                        <Col lg={16} md={16} span={24}>
                            <Input
                                placeholder="Search advertisements"
                                prefix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleSearchIconClick} />}
                                value={pendingSearch}
                                onChange={handleSearchInput}
                                style={{ width: '100%' }}
                                onPressEnter={handleSearch}
                            />
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <Button type="primary" onClick={() => {
                                setSelectedAdvertisement(null);
                                setEditModalVisible(true);
                            }}>
                                Add Advertisement
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <AdvertisementTable
                advertisements={advertisements}
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
                <AdvertisementForm
                    visible={editModalVisible}
                    onCancel={() => {
                        setEditModalVisible(false);
                        setSelectedAdvertisement(null);
                    }}
                    onSubmit={handleFormSubmit}
                    initialValues={selectedAdvertisement}
                    title={selectedAdvertisement ? "Edit Advertisement" : "Add Advertisement"}
                    loading={formLoading}
                />
            )}
        </div>
    );
} 