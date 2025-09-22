'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Button, Tag, Space, Typography, Image, App, Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { articleCrud } from '@/store/article/crud';
import { tagCrud, Tag as ApiTag } from '@/store/tags/crud';
import { categoryCrud, Category as ApiCategory } from '@/store/categories/crud';
import ArticleRenderer from '@/components/ArticleRenderer';
import ArticleMeta from '@/components/ArticleMeta';
import ArticleBreadcrumb from '@/components/ArticleBreadcrumb';
import TableOfContents from '@/components/TableOfContents';
import SocialMediaLinks from '@/components/SocialMediaLinks';
import AdvertisementSection from '@/components/AdvertisementSection';
import styles from './page.module.scss';

const { Title, Paragraph, Text } = Typography;

interface Article {
    id: string;
    title: string;
    description: string;
    content: string;
    textContent?: string;
    image: string;
    tags: { id: string; name: string; description?: string }[];
    category: { id: string; name: string; description?: string };
    createdAt: string;
    updatedAt: string;
    contentBlocks?: any[];
    advertisements?: { id: string; title: string; imageUrl: string; link: string }[];
    ratingAvg: number;
    authorName: string;
}

export default function ArticleDetailPage({ params }: { params: { id: string, noHeader?: boolean } }) {
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
                {!params.noHeader && (
                    <ArticleBreadcrumb
                        articleTitle={article.title}
                        articleId={article.id}
                    />
                )}

                {/* Article Layout with Table of Contents */}
                <div className={styles.articleLayout}>

                    <div className={`${styles.tableOfContentsWrapper} ${styles.tocColumn}`}>
                        <TableOfContents />
                        {Array.isArray(article.advertisements) && article.advertisements.slice(1, 2).map((ad, idx) => (
                            ad.imageUrl ? (
                                <div key={ad.id || idx} style={{ width: '100%', maxWidth: 600, margin: '24px auto 0 auto' }}>
                                    <img
                                        src={ad.imageUrl}
                                        alt={ad.title || 'Advertisement'}
                                        width={280}
                                        height={240}
                                        style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
                                        onClick={() => {
                                            window.open(ad.link, '_blank');
                                        }}
                                    />
                                </div>
                            ) : null
                        ))}
                    </div>

                    <div className={styles.articleContentWrapper}>
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
                                    categoryName={article.category?.name || 'No category'}
                                    tags={article.tags.map(tag => tag.name)}
                                    ratingAvg={article.ratingAvg || 0}
                                    authorName={article.authorName || ''}
                                />

                                <div
                                    className={styles.introCard}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        margin: '24px 0',
                                        border: '1px solid #e8e8e8',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        width: '60px',
                                        height: '60px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '24px', color: 'white' }}>🏠</span>
                                    </div>

                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <Text style={{
                                            color: 'white',
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            display: 'block'
                                        }}>
                                            {article.description}
                                        </Text>

                                        <div style={{
                                            marginTop: '12px',
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Tag color="white" style={{ color: '#667eea', fontWeight: '500' }}>🏠 Nhà cửa</Tag>
                                            <Tag color="white" style={{ color: '#667eea', fontWeight: '500' }}>🔧 Thiết bị</Tag>
                                            <Tag color="white" style={{ color: '#667eea', fontWeight: '500' }}>💡 Ý tưởng</Tag>
                                            <Tag color="white" style={{ color: '#667eea', fontWeight: '500' }}>📋 Thông tin</Tag>
                                        </div>
                                    </div>
                                    <Title level={4} style={{
                                        color: 'white',
                                        margin: '24px 0 12px 0',
                                        fontSize: '18px',
                                        fontWeight: '600'
                                    }}>
                                        🛒 Xem ngay sản phẩm được review tại đây
                                    </Title>
                                </div>

                                {/* description */}
                                <p style={{
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    display: 'block',
                                    marginBottom: '16px'
                                }}>
                                    {article.description}
                                </p>

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
                    </div>

                    <div className={styles.tableOfContentsWrapper}>
                        {/* Desktop version - Card */}
                        <div className={styles.desktopSocialCard}>
                            <Card
                                className={styles.socialMediaCard}
                                title={
                                    <Space>
                                        <span style={{ fontSize: '16px' }}>📱</span>
                                        <Text strong style={{ fontSize: '16px' }}>Theo dõi Nhà Hay</Text>
                                    </Space>
                                }
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                <SocialMediaLinks size="large" />
                            </Card>
                            {Array.isArray(article.advertisements) && article.advertisements.slice(0, 1).map((ad, idx) => (
                                ad.imageUrl ? (
                                    <div key={ad.id || idx} style={{ width: '100%', maxWidth: 600, margin: '24px auto 0 auto' }}>
                                        <img
                                            src={ad.imageUrl}
                                            alt={ad.title || 'Advertisement'}
                                            width={280}
                                            height={240}
                                            style={{ width: '100%', borderRadius: 12, objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => {
                                                window.open(ad.link, '_blank');
                                            }}
                                        />
                                    </div>
                                ) : null
                            ))}
                        </div>

                        {/* Mobile version - Collapse */}
                        <div className={styles.mobileSocialCollapse}>
                            <Collapse
                                ghost
                                expandIcon={({ isActive }) => (
                                    <DownOutlined rotate={isActive ? 180 : 0} />
                                )}
                                style={{
                                    background: 'white',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                <Collapse.Panel
                                    header={
                                        <Space>
                                            <span style={{ fontSize: '16px' }}>📱</span>
                                            <Text strong style={{ fontSize: '16px' }}>Theo dõi Nhà Hay</Text>
                                        </Space>
                                    }
                                    key="1"
                                >
                                    <SocialMediaLinks size="middle" />
                                </Collapse.Panel>
                            </Collapse>
                        </div>

                    </div>
                </div>


                {/* Advertisement Section */}
                <AdvertisementSection />
            </Space>
        </div>
    );
}     