'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App, Flex } from 'antd'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import RecentPostItem from './RecentPostItem/RecentPostItem'
import RecentPostsSkeleton from './RecentPostsSkeleton/RecentPostsSkeleton'
import './styles.scss'

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
          pageSize: 5,
          isPublished: true
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

  return (
    <div id="RecentPosts">
      <BlockHeader title="Bài viết gần đây" />
      <Flex vertical gap={24}>
        {recentPosts.map((postItem) => (
          <RecentPostItem key={postItem.id} post={postItem} />
        ))}
      </Flex>
    </div>
  )
}

export default RecentPosts
