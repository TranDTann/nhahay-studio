'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCategoriesStore } from '@/store/categories/categoriesStore';
import { Category } from '@/store/categories/crud';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';
import { showToast } from '@/utils/toast';

export default function CategoriesList() {
    const { categories, loading, error, getCategories, createCategory, updateCategory, deleteCategory } = useCategoriesStore();
    const [searchText, setSearchText] = useState('');
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
                    showToast.success('Category deleted successfully');
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (values: Omit<Category, 'id' | 'createdAt'>) => {
        setFormLoading(true);
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, values);
                showToast.success('Category updated successfully');
            } else {
                await createCategory(values);
                showToast.success('Category created successfully');
            }
            setEditModalVisible(false);
            setSelectedCategory(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (category.description?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    if (loading && categories.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="categories-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>Categories</h1>
                <Space>
                    <Input
                        placeholder="Search categories"
                        prefix={<SearchOutlined />}
                        onChange={e => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" onClick={() => {
                        setSelectedCategory(null);
                        setEditModalVisible(true);
                    }}>
                        Add Category
                    </Button>
                </Space>
            </div>

            <CategoryTable
                categories={filteredCategories}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
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