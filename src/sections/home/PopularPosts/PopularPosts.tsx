'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import { CenterColumnPost } from './ CenterColumnPost'
import { EndColumnPost } from './EndColumnPost'
import { FirstPost } from './FirstPost'
import PopularPostsSkeleton from './PopularPostsSkeleton/PopularPostsSkeleton'
import './styles.css'

const PopularPosts = () => {
  const { message: messageApi } = App.useApp()

  const [polularPosts, setPopularPosts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        const response = await articleCrud.getArticles({
          listType: PostTypeEnum.MOST_VIEWED,
          pageSize: 6
        })
        setPopularPosts(response.result || [])
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
    return <PopularPostsSkeleton />
  }

  if (!polularPosts.length) return null

  const firstPost = polularPosts[0]
  const centerColumnPosts = polularPosts.slice(1, 3) ?? []
  const endColumnPosts = polularPosts.slice(3, 6) ?? []

  return (
    <div>
      <BlockHeader title="Phổ biến" />
      <Row gutter={24}>
        <Col span={8} className="first-post-wrapper">
          <FirstPost post={firstPost} />
        </Col>
        <Col span={8} className="center-post-wrapper">
          {centerColumnPosts.map((postItem) => (
            <CenterColumnPost key={postItem.id} post={postItem} />
          ))}
        </Col>
        <Col span={8} className="end-post-wrapper">
          {endColumnPosts.map((postItem) => (
            <EndColumnPost key={postItem.id} post={postItem} />
          ))}
        </Col>
      </Row>
    </div>
  )
}

export default PopularPosts
