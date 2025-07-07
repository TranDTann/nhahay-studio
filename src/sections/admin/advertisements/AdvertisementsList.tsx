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
    const [sortField, setSortField] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAdvertisements();
                // Fetch categories for the form
                const categoryRes = await categoryCrud.getCategory();
                setCategories(categoryRes.result || []);
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchData();
    }, [getAdvertisements]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filters = {
            search: value,
            sort: sortField,
            sortDis: sortDirection
        };
        setFilters(filters);
    };

    const handleSort = (field: string) => {
        const newSortDirection = field === sortField ? (sortDirection === 0 ? 1 : 0) : 0;
        setSortField(field);
        setSortDirection(newSortDirection);

        const filters = {
            search: searchText,
            sort: field,
            sortDis: newSortDirection
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

    const handleFormSubmit = async (data: Omit<Advertisement, 'id' | 'createdAt'>) => {
        setFormLoading(true);
        try {
            if (selectedAdvertisement) {
                await updateAdvertisement(selectedAdvertisement.id!, data);
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

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page, pageSize);
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
                                prefix={<SearchOutlined />}
                                onChange={e => handleSearch(e.target.value)}
                                style={{ width: '100%' }}
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
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
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
                    categories={categories}
                />
            )}
        </div>
    );
} 