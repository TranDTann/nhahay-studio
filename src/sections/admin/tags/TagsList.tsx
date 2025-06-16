'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTagsStore } from '@/store/tags/tagsStore';
import { Tag } from '@/store/tags/crud';
import TagTable from './components/TagTable';
import TagForm from './components/TagForm';

export default function TagsList() {
    const { tags, loading, error, getTags, createTag, updateTag, deleteTag } = useTagsStore();
    const [searchText, setSearchText] = useState('');
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
    }, [getTags]);

    const handleSearch = (value: string) => {
        setSearchText(value);
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

    const handleFormSubmit = async (name: string) => {
        setFormLoading(true);
        try {
            if (selectedTag) {
                const params = {
                    name,
                    id: selectedTag.id
                }
                console.log(params)
                await updateTag(params);
            } else {
                await createTag(name);
            }
            setEditModalVisible(false);
            setSelectedTag(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (tag.description?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    if (loading && tags.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="tags-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>Tags</h1>
                <Space>
                    <Input
                        placeholder="Search tags"
                        prefix={<SearchOutlined />}
                        onChange={e => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" onClick={() => {
                        setSelectedTag(null);
                        setEditModalVisible(true);
                    }}>
                        Add Tag
                    </Button>
                </Space>
            </div>

            <TagTable
                tags={filteredTags}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
        </div >
    );
} 