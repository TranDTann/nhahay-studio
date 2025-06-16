'use client';

import { useState, useEffect } from 'react';
import { Input, Card, Button, Space, Select, Row, Col, App, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';

interface Article {
    id: string;
    title: string;
    description: string;
    content: string;
    coverImage: string;
    categoryId: string;
    tagIds: string[];
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

export default function ArticlesList() {
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);

    // Mock data - Replace with actual API calls
    useEffect(() => {
        const mockArticles: Article[] = [
            {
                id: '1',
                title: 'Introduction to React',
                description: 'Learn the basics of React and its core concepts',
                content: 'Full content here...',
                coverImage: '/placeholder-image.jpg',
                categoryId: '1',
                tagIds: ['1', '2'],
                createdAt: '2024-03-06'
            },
            {
                id: '2',
                title: 'Next.js 13 Features',
                description: 'Explore the new features in Next.js 13',
                content: 'Full content here...',
                coverImage: '/placeholder-image.jpg',
                categoryId: '2',
                tagIds: ['2', '3'],
                createdAt: '2024-03-06'
            },
        ];

        const mockCategories: Category[] = [
            { id: '1', name: 'Frontend' },
            { id: '2', name: 'Backend' },
        ];

        const mockTags: Tag[] = [
            { id: '1', name: 'React' },
            { id: '2', name: 'JavaScript' },
            { id: '3', name: 'Next.js' },
        ];

        setTimeout(() => {
            setArticles(mockArticles);
            setCategories(mockCategories);
            setTags(mockTags);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSearch = (value: string) => {
        setFilterLoading(true);
        setSearchText(value);
        setTimeout(() => setFilterLoading(false), 500); // Simulate API delay
    };

    const handleCategoryChange = (value: string | null) => {
        setFilterLoading(true);
        setSelectedCategory(value);
        setTimeout(() => setFilterLoading(false), 500); // Simulate API delay
    };

    const handleTagsChange = (values: string[]) => {
        setFilterLoading(true);
        setSelectedTags(values);
        setTimeout(() => setFilterLoading(false), 500); // Simulate API delay
    };

    const handleEdit = (id: string) => {
        router.push(paths.admin.article(id));
    };

    const handleDelete = (id: string) => {
        // Mock delete - Replace with actual API call
        setArticles(prev => prev.filter(article => article.id !== id));
        messageApi.success('Article deleted successfully');
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase()) ||
            article.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = !selectedCategory || article.categoryId === selectedCategory;
        const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => article.tagIds.includes(tag));
        return matchesSearch && matchesCategory && matchesTags;
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="articles-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>Articles</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Input
                                placeholder="Search articles"
                                prefix={<SearchOutlined />}
                                onChange={e => handleSearch(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col span={6}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select Category"
                                allowClear
                                onChange={handleCategoryChange}
                            >
                                {categories.map(category => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select Tags"
                                onChange={handleTagsChange}
                            >
                                {tags.map(tag => (
                                    <Select.Option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" onClick={() => router.push(paths.admin.article('new'))}>
                                Add Article
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <Spin spinning={filterLoading}>
                <Row gutter={[16, 16]}>
                    {filteredArticles.map(article => (
                        <Col xs={24} sm={12} md={8} lg={6} key={article.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={article.title}
                                        src={article.coverImage}
                                        style={{ height: 200, objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <Button
                                        key="edit"
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(article.id)}
                                    >
                                        Edit
                                    </Button>,
                                    <Button
                                        key="delete"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(article.id)}
                                    >
                                        Delete
                                    </Button>
                                ]}
                            >
                                <Card.Meta
                                    title={article.title}
                                    description={
                                        <div>
                                            <p>{article.description}</p>
                                            <Space>
                                                {article.tagIds.map(tagId => {
                                                    const tag = tags.find(t => t.id === tagId);
                                                    return tag ? (
                                                        <span key={tag.id} style={{
                                                            background: '#f0f0f0',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}>
                                                            {tag.name}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </Space>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Spin>
        </div>
    );
} 