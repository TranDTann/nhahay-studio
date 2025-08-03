'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Button, Tag, Space, Typography, Image, App, Collapse } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { articleCrud } from '@/store/article/crud';
import { tagCrud, Tag as ApiTag } from '@/store/tags/crud';
import { categoryCrud, Category as ApiCategory } from '@/store/categories/crud';
import { convertContentStringToBlocks } from '@/utils/contentBlocksUtils';
import ArticleRenderer from '@/components/ArticleRenderer';
import ArticleMeta from '@/components/ArticleMeta';
import ArticleBreadcrumb from '@/components/ArticleBreadcrumb';
import TableOfContents from '@/components/TableOfContents';
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
    advertisements?: { id: string; title: string; imageUrl: string }[];
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

                {/* Article Layout with Table of Contents */}
                <div className={styles.articleLayout}>
                    {/* Table of Contents - Left Sidebar */}
                    <div className={styles.tableOfContentsWrapper}>
                        <TableOfContents />
                        {Array.isArray(article.advertisements) && article.advertisements.slice(1, 2).map((ad, idx) => (
                            ad.imageUrl ? (
                                <div key={ad.id || idx} style={{ width: '100%', maxWidth: 600, margin: '24px auto 0 auto' }}>
                                    <Image
                                        src={ad.imageUrl}
                                        alt={ad.title || 'Advertisement'}
                                        width={280}
                                        height={240}
                                        style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
                                    />
                                </div>
                            ) : null
                        ))}
                    </div>

                    {/* Article Content - Main Area */}
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
                                        <Title level={4} style={{
                                            color: 'white',
                                            margin: '0 0 12px 0',
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                            👋 Chào mừng bạn đến với Nhahaystudio.vn
                                        </Title>

                                        <Text style={{
                                            color: 'rgba(255, 255, 255, 0.95)',
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            display: 'block'
                                        }}>
                                            Chúng tôi là kênh truyền thông giải trí nội dung chuyên về <strong>Nhà và các thiết bị liên quan</strong>.
                                            Mục tiêu của chúng tôi là giúp những ai đang vào nhà, xây nhà, mua sắm các thiết bị và tìm kiếm thông tin,
                                            chọn ý tưởng và tìm đơn vị cung cấp uy tín.
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
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f5f5f5'
                                    }}>
                                        <span style={{ fontSize: '18px' }}>🎵</span>
                                        <a
                                            href="https://www.tiktok.com/@nhahaystudio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#40a9ff';
                                                e.currentTarget.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#1890ff';
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            TikTok
                                        </a>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f5f5f5'
                                    }}>
                                        <span style={{ fontSize: '18px' }}>📘</span>
                                        <a
                                            href="https://www.facebook.com/nhahaystudio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#40a9ff';
                                                e.currentTarget.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#1890ff';
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            Facebook
                                        </a>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f5f5f5'
                                    }}>
                                        <span style={{ fontSize: '18px' }}>📷</span>
                                        <a
                                            href="https://www.instagram.com/nhahaystudio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#40a9ff';
                                                e.currentTarget.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#1890ff';
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            Instagram
                                        </a>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f5f5f5'
                                    }}>
                                        <span style={{ fontSize: '18px' }}>📺</span>
                                        <a
                                            href="https://www.youtube.com/@nhahaystudio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#40a9ff';
                                                e.currentTarget.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#1890ff';
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            YouTube
                                        </a>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 0'
                                    }}>
                                        <span style={{ fontSize: '18px' }}>💬</span>
                                        <a
                                            href="https://zalo.me/0329000000"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#40a9ff';
                                                e.currentTarget.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#1890ff';
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            Zalo
                                        </a>
                                    </div>
                                </Space>
                            </Card>
                            {Array.isArray(article.advertisements) && article.advertisements.slice(0, 1).map((ad, idx) => (
                                ad.imageUrl ? (
                                    <div key={ad.id || idx} style={{ width: '100%', maxWidth: 600, margin: '24px auto 0 auto' }}>
                                        <Image
                                            src={ad.imageUrl}
                                            alt={ad.title || 'Advertisement'}
                                            width={280}
                                            height={240}
                                            style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
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
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f5f5f5'
                                        }}>
                                            <span style={{ fontSize: '18px' }}>🎵</span>
                                            <a
                                                href="https://www.tiktok.com/@nhahaystudio"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#1890ff',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#40a9ff';
                                                    e.currentTarget.style.textDecoration = 'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#1890ff';
                                                    e.currentTarget.style.textDecoration = 'none';
                                                }}
                                            >
                                                TikTok
                                            </a>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f5f5f5'
                                        }}>
                                            <span style={{ fontSize: '18px' }}>📘</span>
                                            <a
                                                href="https://www.facebook.com/nhahaystudio"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#1890ff',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#40a9ff';
                                                    e.currentTarget.style.textDecoration = 'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#1890ff';
                                                    e.currentTarget.style.textDecoration = 'none';
                                                }}
                                            >
                                                Facebook
                                            </a>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f5f5f5'
                                        }}>
                                            <span style={{ fontSize: '18px' }}>📷</span>
                                            <a
                                                href="https://www.instagram.com/nhahaystudio"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#1890ff',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#40a9ff';
                                                    e.currentTarget.style.textDecoration = 'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#1890ff';
                                                    e.currentTarget.style.textDecoration = 'none';
                                                }}
                                            >
                                                Instagram
                                            </a>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f5f5f5'
                                        }}>
                                            <span style={{ fontSize: '18px' }}>📺</span>
                                            <a
                                                href="https://www.youtube.com/@nhahaystudio"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#1890ff',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#40a9ff';
                                                    e.currentTarget.style.textDecoration = 'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#1890ff';
                                                    e.currentTarget.style.textDecoration = 'none';
                                                }}
                                            >
                                                YouTube
                                            </a>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 0'
                                        }}>
                                            <span style={{ fontSize: '18px' }}>💬</span>
                                            <a
                                                href="https://zalo.me/0329000000"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#1890ff',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#40a9ff';
                                                    e.currentTarget.style.textDecoration = 'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#1890ff';
                                                    e.currentTarget.style.textDecoration = 'none';
                                                }}
                                            >
                                                Zalo
                                            </a>
                                        </div>
                                    </Space>
                                </Collapse.Panel>
                            </Collapse>
                        </div>

                    </div>
                </div>

                <div className={styles.advertisements} style={{ width: '100%', margin: '32px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: 16, marginBottom: 16 }}>
                        Những người theo dõi <span style={{ color: 'red', fontWeight: 600 }}>nhahaystudio.vn</span> đã lâu khi muốn tìm mua các sản phẩm mà chúng tôi review họ sẽ truy cập vào
                        <a style={{ color: 'red', fontWeight: 600, marginLeft: 4 }} href="https://nhahaystudio.com" target="_blank" rel="noopener noreferrer">nhahaystudio.com</a>
                        (đây là website con nằm trong hệ sinh thái NHÀ, tại đây trưng bày các sản phẩm mà chúng tôi đánh giá là HAY!)
                    </p>
                    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto 24px auto' }}>
                        <Image src="/images/nhahaystudio.com.png" alt="nhahaystudio.com" width={600} height={200} style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }} />
                    </div>
                    <div className={styles.advertisementsContent} style={{ width: '70%', margin: '0 auto', background: '#fafbfc', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <p style={{ fontSize: 15, marginBottom: 24 }}>
                            Nhahaystudio.vn là sản phẩm nằm trong hệ sinh thái Nhà của chúng tôi gồm: <b>Tiktok Nhà hay Studio</b>, <b>Youtube Nhà Hay Studio</b>, <b>Facebook Nhà Hay Studio</b>...vv
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
                            <div style={{ minWidth: 180, maxWidth: 220, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', padding: 16, marginBottom: 16 }}>
                                <h4 style={{ color: '#e53935', marginBottom: 8 }}>Youtube</h4>
                                <p style={{ margin: 0, color: '#333' }}>Chia sẻ những clip chuyên sâu và thú vị</p>
                            </div>
                            <div style={{ minWidth: 180, maxWidth: 220, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', padding: 16, marginBottom: 16 }}>
                                <h4 style={{ color: '#1da1f2', marginBottom: 8 }}>Tiktok</h4>
                                <p style={{ margin: 0, color: '#333' }}>Tóm tắt tin và những đánh giá nhanh</p>
                            </div>
                            <div style={{ minWidth: 180, maxWidth: 220, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', padding: 16, marginBottom: 16 }}>
                                <h4 style={{ color: '#1877f2', marginBottom: 8 }}>Facebook</h4>
                                <p style={{ margin: 0, color: '#333' }}>Cập nhật các thông báo mới nhất tới bạn đọc</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Space>
        </div>
    );
}     