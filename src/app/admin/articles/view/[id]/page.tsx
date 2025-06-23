'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Button, Tag, Space, Typography, Image, App } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { articleCrud } from '@/store/article/crud';
import { tagCrud, Tag as ApiTag } from '@/store/tags/crud';
import { categoryCrud, Category as ApiCategory } from '@/store/categories/crud';
import { convertContentStringToBlocks } from '@/utils/contentBlocksUtils';
import ArticleRenderer from '@/components/ArticleRenderer';
import ArticleMeta from '@/components/ArticleMeta';
import ArticleBreadcrumb from '@/components/ArticleBreadcrumb';
import styles from './page.module.scss';

const { Title, Paragraph, Text } = Typography;

interface Article {
    id: string;
    title: string;
    description: string;
    content: string;
    textContent?: string;
    image: string;
    tags: string[];
    categoryId?: string;
    createdAt: string;
    updatedAt: string;
    contentBlocks?: any[];
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [article, setArticle] = useState<Article | null>(null);
    const [tags, setTags] = useState<ApiTag[]>([]);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [articleRes, tagsRes, categoriesRes] = await Promise.all([
                    articleCrud.getArticleById(params.id),
                    tagCrud.getTags(),
                    categoryCrud.getCategory()
                ]);

                setArticle(articleRes);
                setTags(tagsRes.result || []);
                setCategories(categoriesRes.result || []);
            } catch (error: any) {
                messageApi.error(error.response?.data?.message || 'Failed to fetch article detail');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const getTagName = (tagId: string) => {
        const tag = tags.find(t => t.id === tagId);
        return tag?.name || tagId;
    };

    const getCategoryName = (categoryId?: string) => {
        if (!categoryId) return 'No category';
        const category = categories.find(c => c.id === categoryId);
        return category?.name || categoryId;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className={styles.errorContainer}>
                <Title level={3}>Article not found</Title>
                <Button type="primary" onClick={() => router.push(paths.admin.articles())}>
                    Back to Articles
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Breadcrumb */}
                <ArticleBreadcrumb
                    articleTitle={article.title}
                    articleId={article.id}
                />

                {/* Article Content */}
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Title */}
                        <Title level={1} style={{ margin: 0 }}>
                            {article.title}
                        </Title>

                        {/* Meta Information */}
                        <ArticleMeta
                            createdAt={article.createdAt}
                            updatedAt={article.updatedAt}
                            categoryName={getCategoryName(article.categoryId)}
                            tags={article.tags.map(tagId => getTagName(tagId))}
                        />

                        {/* Content */}
                        <div>
                            <ArticleRenderer
                                content={article.content}
                                contentBlocks={article.contentBlocks}
                                className={styles.articleContent}
                            />
                        </div>
                    </Space>
                </Card>
            </Space>
        </div>
    );
} 