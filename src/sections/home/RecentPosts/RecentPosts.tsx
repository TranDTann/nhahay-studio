'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import MainRecentPost from './MainRecentPost/MainRecentPost'
import RecentPostItem from './RecentPostItem/RecentPostItem'
import { RecentPostsAdvertising } from './RecentPostsAdvertising'
import RecentPostsSkeleton from './RecentPostsSkeleton/RecentPostsSkeleton'
import './styles.css'

const RecentPosts = () => {
  const { message: messageApi } = App.useApp()

  const [recentPosts, setRecentPosts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        const response = await articleCrud.getArticles({
          listType: PostTypeEnum.LATEST,
          pageSize: 4
        })
        setRecentPosts(response.result || [])
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
    return <RecentPostsSkeleton />
  }

  if (!recentPosts.length) return null

  const mainPost = recentPosts[0]
  const rightColumnPosts = recentPosts.slice(1, 4)

  const recentPostsContent = (
    <Row gutter={24} className="recent-posts-container">
      <Col span={16} className="main-post-container">
        <MainRecentPost postData={mainPost} />
      </Col>
      <Col span={8} className="right-posts-column-wrapper">
        <div className="right-posts-grid">
          {rightColumnPosts.map((post) => (
            <RecentPostItem key={post.id} postData={post} />
          ))}
        </div>
      </Col>
    </Row>
  )

  return (
    <div>
      <BlockHeader title="Bài viết gần đây" />
      <Row gutter={24}>
        <Col span={16}>{recentPostsContent}</Col>
        <Col span={8}>
          <RecentPostsAdvertising />
        </Col>
      </Row>
    </div>
  )
}

export default RecentPosts
