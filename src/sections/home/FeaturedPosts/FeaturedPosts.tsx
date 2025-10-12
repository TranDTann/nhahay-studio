'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import FeaturedPostItem from './FeaturedPostItem/FeaturedPostItem'
import FeaturedPostsSkeleton from './FeaturedPostsSkeleton/FeaturedPostsSkeleton'
import MainFeaturedPost from './MainFeaturedPost/MainFeaturedPost'
import './styles.scss'

const FeaturedPosts = () => {
  const { message: messageApi } = App.useApp()

  const [featuredPosts, setFeaturedPosts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        const response = await articleCrud.getArticles({
          listType: PostTypeEnum.FEATURED_POSTS,
          pageSize: 4,
          isPublished: true
        })
        setFeaturedPosts(response.result || [])
      } catch (error: any) {
        messageApi.error(
          error.response?.data?.message || 'Failed to fetch articles'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (isLoading) {
    return <FeaturedPostsSkeleton />
  }

  if (!featuredPosts.length)
    return <div className="add-post-noti">Thêm các bài viết nổi bật ở đây</div>

  const mainPost = featuredPosts[0]
  const rightColumnPosts = featuredPosts.slice(1, 4)

  return (
    <div id="FeaturedPosts">
      <Row gutter={[24, 24]} className="featured-posts-container">
        <Col xs={24} md={24} lg={16} className="main-post-container">
          <MainFeaturedPost postData={mainPost} />
        </Col>
        <Col xs={24} md={24} lg={8} className="right-posts-column-wrapper">
          <div className="right-posts-grid" id="FeaturedPostItem">
            {rightColumnPosts.map((post) => (
              <FeaturedPostItem key={post.id} postData={post} />
            ))}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default FeaturedPosts
