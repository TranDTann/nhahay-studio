'use client'

import AdvertisementSection from '@/components/AdvertisementSection'
import ArticleBreadcrumb from '@/components/ArticleBreadcrumb'
import ArticleMeta from '@/components/ArticleMeta'
import ArticleRenderer from '@/components/ArticleRenderer'
import SocialMediaLinks from '@/components/SocialMediaLinks'
import TableOfContents from '@/components/TableOfContents'
import { useSessionConfig } from '@/hooks/useSessionConfig'
import paths from '@/routes/paths'
import { advertisementCrud } from '@/store/advertisement/crud'
import { articleCrud } from '@/store/article/crud'
import { Category as ApiCategory, categoryCrud } from '@/store/categories/crud'
import { Tag as ApiTag, tagCrud } from '@/store/tags/crud'
import { DownOutlined, LinkOutlined, UserOutlined } from '@ant-design/icons'
import { EConfig } from '@/types/config'
import { App, Button, Card, Collapse, Space, Spin, Tag, Typography } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.scss'

const { Title, Paragraph, Text } = Typography

interface Article {
  id: string
  title: string
  description: string
  content: string
  textContent?: string
  image: string
  tags: { id: string; name: string; description?: string }[]
  category: { id: string; name: string; description?: string }
  createdAt: string
  updatedAt: string
  publishAt: string
  contentBlocks?: any[]
  advertisements?: {
    id: string
    title: string
    imageUrl: string
    link: string
  }[]
  valueRating: number
  authorName: string
}

export default function ArticleDetailPage({
  params
}: {
  params: { id: string; noHeader?: boolean }
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Check if this is admin route
  const isAdminRoute = pathname?.includes('/admin/')

  // Helper function to track advertisement click (only for user, not admin)
  const handleAdvertisementClick = async (adId: string, link: string) => {
    console.log(isAdminRoute)
    console.log(adId)
    console.log(link)
    if (!isAdminRoute && adId) {
      console.log(123)
      // Track click with isClick = true for user
      await advertisementCrud.trackClick(adId, true)
    }
    window.open(link, '_blank')
  }
  const { message: messageApi } = App.useApp()
  const { getConfigByKey } = useSessionConfig()
  const [article, setArticle] = useState<Article | null>(null)
  const [tags, setTags] = useState<ApiTag[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [tocActiveKey, setTocActiveKey] = useState<string[]>([])
  const [followActiveKey, setFollowActiveKey] = useState<string[]>(['follow'])
  const greetingDetail = getConfigByKey(EConfig.GREETING_DETAIL_ARTICLE) || ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [articleRes, tagsRes, categoriesRes] = await Promise.all([
          articleCrud.getArticleById(params.id),
          tagCrud.getTags(),
          categoryCrud.getCategory()
        ])

        setArticle(articleRes)
        setTags(tagsRes.result || [])
        setCategories(categoriesRes.result || [])
      } catch (error: any) {
        messageApi.error(
          error.response?.data?.message || 'Failed to fetch article detail'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className={styles.errorContainer}>
        <Title level={3}>Article not found</Title>
        <Button
          type="primary"
          onClick={() => router.push(paths.admin.articles())}
        >
          Back to Articles
        </Button>
      </div>
    )
  }

  return (
    <div>
      {!params.noHeader && (
        <ArticleBreadcrumb
          articleTitle={article.title}
          articleId={article.id}
        />
      )}


      {/* Title */}
      <ArticleMeta
        createdAt={article.createdAt}
        updatedAt={article.updatedAt}
        publishAt={article?.publishAt}
        categoryName={article.category?.name || 'No category'}
        tags={article.tags.map((tag) => tag.name)}
        valueRating={article.valueRating || 0}
        authorName={article.authorName || ''}
      />
      <div className={styles.articleTitle}>{article.title}</div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>

        {/* Article Layout with Table of Contents */}
        <div className={styles.articleLayout}>
          {/* Left Column - Table of Contents (Desktop) */}
          <div className={styles.tableOfContentsWrapper}>
            <TableOfContents />
          </div>

          <div className={styles.articleContentWrapper}>

            {/* Mobile version - Collapse for Table of Contents and Follow (at top) */}
            <div className={styles.mobileCollapseWrapper}>
              {/* Mobile - Table of Contents Collapse (default closed) */}
              <div className={styles.mobileTocCollapseWrapper}>
                <Collapse
                  ghost
                  activeKey={tocActiveKey}
                  onChange={(keys) => setTocActiveKey(keys as string[])}
                  expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 180 : 0} />
                  )}
                  style={{
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    marginBottom: '16px'
                  }}
                >
                  <Collapse.Panel
                    header={
                      <Space>
                        <LinkOutlined />
                        <Text strong style={{ fontSize: '16px' }}>
                          Mục lục
                        </Text>
                      </Space>
                    }
                    key="toc"
                  >
                    <div style={{ padding: '8px 0' }}>
                      {tocActiveKey.includes('toc') && (
                        <TableOfContents renderOnly={true} />
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>

              {/* Mobile - Follow Collapse (default open) */}
              <div className={styles.mobileSocialCollapse}>
                <Collapse
                  ghost
                  activeKey={followActiveKey}
                  onChange={(keys) => setFollowActiveKey(keys as string[])}
                  expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 180 : 0} />
                  )}
                  style={{
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    marginBottom: '16px'
                  }}
                >
                  <Collapse.Panel
                    header={
                      <Space>
                        <span style={{ fontSize: '16px' }}>📱</span>
                        <Text strong style={{ fontSize: '16px' }}>
                          Theo dõi Nhà Hay
                        </Text>
                      </Space>
                    }
                    key="follow"
                  >
                    <SocialMediaLinks size="middle" />
                  </Collapse.Panel>
                </Collapse>
              </div>
            </div>

            <Space
              direction="vertical"
              size="large"
              style={{ width: '100%' }}
            >

              {/* Meta Information */}

              <div
                className={styles.introCard}
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e8e8e8',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
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
                  }}
                >
                  <span style={{ fontSize: '24px', color: 'white' }}>🏠</span>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      display: 'block'
                    }}
                  >
                    {greetingDetail}
                  </Text>

                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Tag
                      color="white"
                      style={{ color: '#667eea', fontWeight: '500' }}
                    >
                      🏠 Nhà cửa
                    </Tag>
                    <Tag
                      color="white"
                      style={{ color: '#667eea', fontWeight: '500' }}
                    >
                      🔧 Thiết bị
                    </Tag>
                    <Tag
                      color="white"
                      style={{ color: '#667eea', fontWeight: '500' }}
                    >
                      💡 Ý tưởng
                    </Tag>
                    <Tag
                      color="white"
                      style={{ color: '#667eea', fontWeight: '500' }}
                    >
                      📋 Thông tin
                    </Tag>
                  </div>
                </div>
                {/* <Title
                  level={4}
                  style={{
                    color: 'white',
                    margin: '24px 0 12px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  🛒 Xem ngay sản phẩm được review tại đây
                </Title> */}
              </div>

              {/* description */}
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  display: 'block',
                  marginBottom: '16px'
                }}
              >
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
          </div>

          {/* Desktop version - Right column for Social Media and Ads */}
          <div className={styles.desktopLargeSocialWrapper}>
            <div className={styles.desktopLargeSocialCard}>
              <Card
                className={styles.socialMediaCard}
                title={
                  <Space>
                    <span style={{ fontSize: '16px' }}>📱</span>
                    <Text strong style={{ fontSize: '16px' }}>
                      Theo dõi Nhà Hay
                    </Text>
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
              {Array.isArray(article.advertisements) &&
                article.advertisements.slice(0, 1).map((ad, idx) =>
                  ad.imageUrl ? (
                    <div
                      key={ad.id || idx}
                      style={{
                        width: '100%',
                        maxWidth: 600,
                        margin: '24px auto 0 auto'
                      }}
                    >
                      <img
                        src={ad.imageUrl}
                        alt={ad.title || 'Advertisement'}
                        width={280}
                        height={240}
                        style={{
                          width: '100%',
                          borderRadius: 12,
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          handleAdvertisementClick(ad.id, ad.link)
                        }}
                      />
                    </div>
                  ) : null
                )}
            </div>
          </div>
        </div>

        {/* Advertisement Section */}
        <AdvertisementSection />
      </Space>
    </div>
  )
}
