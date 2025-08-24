'use client';

import { useState, useEffect } from 'react';
import { Input, Card, Button, Space, Select, Row, Col, App, Spin, Pagination, Checkbox } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { articleCrud } from '@/store/article/crud';
import { tagCrud, Tag as ApiTag } from '@/store/tags/crud';
import { categoryCrud, Category as ApiCategory } from '@/store/categories/crud';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import styles from './Article.module.scss';

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
    publishAt: string | null;
}

export default function ArticlesList() {
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [articles, setArticles] = useState<Article[]>([]);
    const [tags, setTags] = useState<ApiTag[]>([]);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [publishLoading, setPublishLoading] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [pendingSearch, setPendingSearch] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [SortDir, setSortDirection] = useState<number>(0);

    useEffect(() => {
        fetchTags();
        fetchCategories();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchArticles();
        // eslint-disable-next-line
    }, [page, pageSize]);

    const fetchArticles = async (customFilter?: { search?: string; tags?: string[]; categoryId?: string; sort?: string; SortDir?: number }, isSearch = false) => {
        try {
            if (isSearch) {
                setListLoading(true);
            } else {
                setLoading(true);
            }
            const response = await articleCrud.getArticles({
                search: customFilter?.search ?? searchText,
                tags: customFilter?.tags ?? selectedTags,
                categoryId: customFilter?.categoryId ?? selectedCategory,
                page,
                pageSize,
                sort: customFilter?.sort ?? sortField,
                SortDir: customFilter?.SortDir ?? SortDir
            });
            setArticles(response.result || []);
            setTotal(response.count || 0);
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to fetch articles');
        } finally {
            if (isSearch) {
                setListLoading(false);
            } else {
                setLoading(false);
            }
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

    const handleSearch = () => {
        setSearchText(pendingSearch);
        setPage(1);
        fetchArticles({
            search: pendingSearch,
            tags: selectedTags,
            categoryId: selectedCategory,
            sort: sortField,
            SortDir: SortDir
        }, true);
    };

    const handleSearchIconClick = () => {
        handleSearch();
    };

    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
        setPage(1);
        fetchArticles({
            search: pendingSearch,
            tags: values,
            categoryId: selectedCategory,
            sort: sortField,
            SortDir: SortDir
        }, true);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setPage(1);
        fetchArticles({
            search: pendingSearch,
            tags: selectedTags,
            categoryId: value,
            sort: sortField,
            SortDir: SortDir
        }, true);
    };

    const handleSort = (field: string) => {
        const newSortDirection = field === sortField ? (SortDir === 0 ? 1 : 0) : 0;
        setSortField(field);
        setSortDirection(newSortDirection);
        setPage(1);
        fetchArticles({
            search: pendingSearch,
            tags: selectedTags,
            categoryId: selectedCategory,
            sort: field,
            SortDir: newSortDirection
        }, true);
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

    const handlePublish = async (id: string, isPublished: boolean) => {
        try {
            setPublishLoading(id);
            const publishAt = isPublished ? new Date().toISOString() : null;

            // Get the current article data
            const currentArticle = articles.find(article => article.id === id);
            if (!currentArticle) {
                messageApi.error('Article not found');
                return;
            }

            // Prepare article data with all required fields
            const articleData = {
                title: currentArticle.title,
                description: currentArticle.description,
                content: currentArticle.content,
                image: currentArticle.image,
                tagIds: currentArticle.tags.map(tag => tag.id),
                categoryId: currentArticle.category.id,
                publishAt: publishAt
            };

            await articleCrud.updateArticle(id, articleData);

            // Update the local state
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === id
                        ? { ...article, publishAt }
                        : article
                )
            );

            messageApi.success(isPublished ? 'Article published successfully' : 'Article unpublished successfully');
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to update article publish status');
        } finally {
            setPublishLoading(null);
        }
    };


    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div className="articles-container" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ marginBottom: '24px' }}>Articles</h1>
                        <Button
                            type="primary"
                            onClick={() => router.push(paths.admin.article('new'))}
                            style={{ width: 'max-content' }}
                            icon={<PlusOutlined />}
                            className={`${styles.addArticleBtn}`}
                        >
                            <span className={styles.btnText}>Add Article</span>
                        </Button>
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Row gutter={[16, 16]}>
                            <Col lg={8} md={12} span={24}>
                                <Input
                                    placeholder="Search articles"
                                    prefix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleSearchIconClick} />}
                                    value={pendingSearch}
                                    onChange={handleSearchInput}
                                    style={{ width: '100%' }}
                                    onPressEnter={handleSearch}
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
                            <Col lg={6} md={12} span={24}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Sort by"
                                    value={sortField ? `${sortField}-${SortDir}` : undefined}
                                    onChange={(value) => {
                                        if (value) {
                                            const [field, direction] = value.split('-');
                                            setSortField(field);
                                            setSortDirection(parseInt(direction));
                                            setPage(1);
                                            fetchArticles({
                                                search: pendingSearch,
                                                tags: selectedTags,
                                                categoryId: selectedCategory,
                                                sort: field,
                                                SortDir: parseInt(direction)
                                            }, true);
                                        } else {
                                            setSortField('');
                                            setSortDirection(0);
                                            setPage(1);
                                            fetchArticles({
                                                search: pendingSearch,
                                                tags: selectedTags,
                                                categoryId: selectedCategory,
                                                sort: '',
                                                SortDir: 0
                                            }, true);
                                        }
                                    }}
                                    allowClear
                                >
                                    <Select.Option value="createdAt-0">Newest First</Select.Option>
                                    <Select.Option value="createdAt-1">Oldest First</Select.Option>
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

                        </Row>
                    </Space>
                </div>

                <Spin spinning={listLoading || loading}>
                    {articles.length > 0 ? (
                        <>
                            <Row gutter={[16, 16]}>
                                {articles.map(article => (
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
                                                // <Checkbox
                                                //     key="publish"
                                                //     checked={!!article.publishAt}
                                                //     onChange={(e) => handlePublish(article.id, e.target.checked)}
                                                //     disabled={publishLoading === article.id}
                                                //     style={{ marginLeft: 8 }}
                                                // >
                                                //     Publish
                                                // </Checkbox>,
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
                                                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: '48px' }}>{article.description}</p>
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
                                                            <div>
                                                                <strong>Created:</strong>{' '}
                                                                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                }) : '-'}
                                                            </div>
                                                        </Space>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            {total > pageSize && (
                                <div style={{ marginTop: 24, textAlign: 'center' }}>
                                    <Pagination
                                        current={page}
                                        pageSize={pageSize}
                                        total={total}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '50px 20px',
                            color: '#666',
                            fontSize: '16px'
                        }}>
                            {searchText || selectedCategory || selectedTags.length > 0 ? (
                                <div>
                                    <p>No articles found matching your search criteria.</p>
                                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                                        Try adjusting your search terms or filters.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p>No articles available.</p>
                                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                                        Create your first article to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Spin>
            </div>
        </>
    );
} 