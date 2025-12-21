'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { useFeaturedPostStore } from '@/store/featuredPost/featuredPostStore'
import { App, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import FeaturedPostsSkeleton from './FeaturedPostsSkeleton/FeaturedPostsSkeleton'
import MainFeaturedPost from './MainFeaturedPost/MainFeaturedPost'
import './styles.scss'
import SubFeaturedPost from './SubFeaturedPost/SubFeaturedPost'

const FeaturedPosts = () => {
  const { message: messageApi } = App.useApp()

  const { isLoading } = useFeaturedPostStore((state) => state)

  const [featuredPosts, setFeaturedPosts] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        useFeaturedPostStore.setState({ isLoading: true })

        const response = await articleCrud.getArticles({
          listType: PostTypeEnum.FEATURED_POSTS,
          pageSize: 4,
          isPublished: true
        })

        setFeaturedPosts(response?.result || [])

        useFeaturedPostStore.setState({ featuredPosts: response?.result || [] })
      } catch (error: any) {
        messageApi.error(
          error.response?.data?.message || 'Failed to fetch articles'
        )
      } finally {
        useFeaturedPostStore.setState({ isLoading: false })
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
  const rightPost = featuredPosts[1]

  return (
    <div id="FeaturedPosts">
      <Row gutter={[24, 24]} className="featured-posts-container">
        <Col xs={24} md={24} lg={18} className="main-post-container">
          <MainFeaturedPost postData={mainPost} />
        </Col>
        <Col xs={24} md={24} lg={6} className="right-posts-wrapper">
          <SubFeaturedPost key={rightPost.id} postData={rightPost} />
        </Col>
      </Row>
    </div>
  )
}

export default FeaturedPosts
