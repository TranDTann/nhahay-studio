'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useBannerStore } from '@/store/banner/bannerStore';
import { Banner } from '@/store/banner/crud';
import BannerTable from './components/BannerTable';
import BannerForm from './components/BannerForm';

export default function BannersList() {
    const {
        banners,
        loading,
        error,
        total,
        currentPage,
        pageSize,
        getBanners,
        setFilters,
        setPage,
        createBanner,
        updateBanner,
        deleteBanner
    } = useBannerStore();

    const [searchText, setSearchText] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getBanners();
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchData();
    }, [getBanners]);

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

    const handleEdit = (record: Banner) => {
        setSelectedBanner(record);
        setEditModalVisible(true);
    };

    const handleDelete = (record: Banner) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this banner?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteBanner(record.id!);
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (data: Banner) => {
        setFormLoading(true);
        try {
            if (selectedBanner) {
                await updateBanner({ ...data, id: selectedBanner.id });
            } else {
                await createBanner(data);
            }
            setEditModalVisible(false);
            setSelectedBanner(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page);
    };

    if (loading && banners.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="banners-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>Banner Management</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                        <Col lg={16} md={16} span={24}>
                            <Input
                                placeholder="Search banners"
                                prefix={<SearchOutlined />}
                                onChange={e => handleSearch(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <Button type="primary" onClick={() => {
                                setSelectedBanner(null);
                                setEditModalVisible(true);
                            }}>
                                Add Banner
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <BannerTable
                banners={banners}
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
                <BannerForm
                    visible={editModalVisible}
                    onCancel={() => {
                        setEditModalVisible(false);
                        setSelectedBanner(null);
                    }}
                    onSubmit={handleFormSubmit}
                    initialValues={selectedBanner}
                    title={selectedBanner ? "Edit Banner" : "Add Banner"}
                    loading={formLoading}
                />
            )}
        </div>
    );
} 