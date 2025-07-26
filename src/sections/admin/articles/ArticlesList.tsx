'use client';

import { useState, useEffect } from 'react';
import { Input, Card, Button, Space, Select, Row, Col, App, Spin, Pagination } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { articleCrud } from '@/store/article/crud';
import { tagCrud, Tag as ApiTag } from '@/store/tags/crud';
import { categoryCrud, Category as ApiCategory } from '@/store/categories/crud';
import { ImgComparisonSlider } from '@img-comparison-slider/react';

interface Article {
    id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    tags: { id: string; name: string; description?: string }[];
    category: { id: string; name: string; description?: string };
    createdAt: string;
    updatedAt: string;
}

export default function ArticlesList() {
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [articles, setArticles] = useState<Article[]>([]);
    const [tags, setTags] = useState<ApiTag[]>([]);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [pendingSearch, setPendingSearch] = useState('');

    useEffect(() => {
        fetchTags();
        fetchCategories();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchArticles();
        // eslint-disable-next-line
    }, [page, pageSize]);

    const fetchArticles = async (customFilter?: { search?: string; tags?: string[]; categoryId?: string }) => {
        try {
            setLoading(true);
            const response = await articleCrud.getArticles({
                search: customFilter?.search ?? searchText,
                tags: customFilter?.tags ?? selectedTags,
                categoryId: customFilter?.categoryId ?? selectedCategory,
                page,
                pageSize
            });
            setArticles(response.result || []);
            setTotal(response.count || 0);
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await tagCrud.getTags();
            setTags(response.result || []);
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to fetch tags');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryCrud.getCategory();
            setCategories(response.result || []);
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to fetch categories');
        }
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPendingSearch(e.target.value);
    };
    const handleSearchClick = () => {
        setSearchText(pendingSearch);
        setPage(1);
        fetchArticles({ search: pendingSearch, tags: selectedTags, categoryId: selectedCategory });
    };
    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
        setPage(1);
        // Không fetchArticles ở đây, chỉ fetch khi bấm Search
    };
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setPage(1);
        // Không fetchArticles ở đây, chỉ fetch khi bấm Search
    };
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleEdit = (id: string) => {
        router.push(paths.admin.article(id));
    };

    const handleView = (id: string) => {
        router.push(paths.admin.articleView(id));
    };

    const handleDelete = async (id: string) => {
        try {
            setDeleteLoading(id);
            await articleCrud.deleteArticle(id);
            const response = await articleCrud.getArticles();
            setArticles(response.result || []);
            messageApi.success('Article deleted successfully');
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to delete article');
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase()) ||
            article.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => article.tags.some(t => t.id === tag));
        const matchesCategory = !selectedCategory || (article.category && article.category.id === selectedCategory);
        return matchesSearch && matchesTags && matchesCategory;
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
                    <Row gutter={[16, 16]}>
                        <Col lg={8} md={12} span={24}>
                            <Input
                                placeholder="Search articles"
                                prefix={<SearchOutlined />}
                                value={pendingSearch}
                                onChange={handleSearchInput}
                                style={{ width: '100%' }}
                                onPressEnter={handleSearchClick}
                            />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select Category"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                allowClear
                            >
                                {categories.map(category => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        {/* <Col lg={4} md={12} span={24}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select Tags"
                                value={selectedTags}
                                onChange={handleTagsChange}
                                allowClear
                            >
                                {tags.map(tag => (
                                    <Select.Option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col> */}
                        <Col lg={4} md={12} span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearchClick} style={{ width: '100%' }}>
                                Search
                            </Button>
                        </Col>
                        <Col lg={4} md={12} span={24}>
                            <Button type="primary" onClick={() => router.push(paths.admin.article('new'))} style={{ width: '100%' }}>
                                Add Article
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <Spin spinning={filterLoading || loading}>
                <Row gutter={[16, 16]}>
                    {filteredArticles.map(article => (
                        <Col xs={24} sm={12} md={8} xxl={6} key={article.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={article.title}
                                        src={article.image}
                                        style={{ height: 200, objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <Button
                                        key="view"
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => handleView(article.id)}
                                    >
                                        View
                                    </Button>,
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
                                        loading={deleteLoading === article.id}
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
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                {article.category && (
                                                    <div>
                                                        <strong>Category:</strong>{' '}
                                                        {article.category.name}
                                                    </div>
                                                )}
                                                <div>
                                                    <strong>Tags:</strong>
                                                    <Space wrap>
                                                        {article.tags && article.tags.length > 0 && article.tags.map((tag, idx) => (
                                                            <span key={tag.id || idx} style={{
                                                                background: '#f0f0f0',
                                                                padding: '2px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}>
                                                                {tag.name}
                                                            </span>
                                                        ))}
                                                    </Space>
                                                </div>
                                            </Space>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Pagination
                        current={page}
                        pageSize={10}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </Spin>
        </div>
    );
} 