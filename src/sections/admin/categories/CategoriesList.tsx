'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCategoriesStore } from '@/store/categories/categoriesStore';
import { Category } from '@/store/categories/crud';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';

export default function CategoriesList() {
    const {
        categories,
        loading,
        error,
        total,
        currentPage,
        pageSize,
        getCategories,
        setFilters,
        setPage,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategoriesStore();
    const [searchText, setSearchText] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await getCategories();
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchCategories();
    }, [getCategories]);

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

    const handleEdit = (record: Category) => {
        setSelectedCategory(record);
        setEditModalVisible(true);
    };

    const handleDelete = (record: Category) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteCategory(record.id);
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (name: string) => {
        setFormLoading(true);
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, name);
            } else {
                await createCategory(name);
            }
            setEditModalVisible(false);
            setSelectedCategory(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page, pageSize);
    };

    if (loading && categories.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="categories-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>Categories</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                        <Col lg={16} md={16} span={24}>
                            <Input
                                placeholder="Search categories"
                                prefix={<SearchOutlined />}
                                onChange={e => handleSearch(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <Button type="primary" onClick={() => {
                                setSelectedCategory(null);
                                setEditModalVisible(true);
                            }}>
                                Add Category
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <CategoryTable
                categories={categories}
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
            {
                editModalVisible && (
                    <CategoryForm
                        visible={editModalVisible}
                        onCancel={() => {
                            setEditModalVisible(false);
                            setSelectedCategory(null);
                        }}
                        onSubmit={handleFormSubmit}
                        initialValues={selectedCategory}
                        title={selectedCategory ? "Edit Category" : "Add Category"}
                        loading={formLoading}
                    />
                )}
        </div>
    );
} 