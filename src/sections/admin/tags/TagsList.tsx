'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTagsStore } from '@/store/tags/tagsStore';
import { Tag } from '@/store/tags/crud';
import TagTable from './components/TagTable';
import TagForm from './components/TagForm';

export default function TagsList() {
    const {
        tags,
        loading,
        error,
        total,
        currentPage,
        pageSize,
        getTags,
        setFilters,
        setPage,
        createTag,
        updateTag,
        deleteTag
    } = useTagsStore();
    const [searchText, setSearchText] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                await getTags();
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchTags();
    }, []);

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

    const handleEdit = (record: Tag) => {
        setSelectedTag(record);
        setEditModalVisible(true);
    };

    const handleDelete = (record: Tag) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this tag?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteTag(record.id);
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (data: { name: string; description?: string }) => {
        setFormLoading(true);
        try {
            if (selectedTag) {
                const params = {
                    name: data.name,
                    description: data.description,
                    id: selectedTag.id
                }
                await updateTag(params);
            } else {
                await createTag({ name: data.name, description: data.description });
            }
            setEditModalVisible(false);
            setSelectedTag(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page, pageSize);
    };

    if (loading && tags.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="tags-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>Tags</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                        <Col lg={16} md={16} span={24}>
                            <Input
                                placeholder="Search tags"
                                prefix={<SearchOutlined />}
                                onChange={e => handleSearch(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <Button type="primary" onClick={() => {
                                setSelectedTag(null);
                                setEditModalVisible(true);
                            }}>
                                Add Tag
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <TagTable
                tags={tags}
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
                    <TagForm
                        visible={editModalVisible}
                        onCancel={() => {
                            setEditModalVisible(false);
                            setSelectedTag(null);
                        }}
                        onSubmit={handleFormSubmit}
                        initialValues={selectedTag}
                        title={selectedTag ? "Edit Tag" : "Add Tag"}
                        loading={formLoading}
                    />
                )}
        </div>
    );
} 