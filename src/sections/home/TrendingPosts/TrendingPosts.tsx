'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App, Flex } from 'antd'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import './styles.scss'
import TrendingPostItem from './TrendingPostItem/TrendingPostItem'
import TrendingPostsSkeleton from './TrendingPostsSkeleton/TrendingPostsSkeleton'

const TrendingPosts = () => {
  const { message: messageApi } = App.useApp()

  const [trendingPosts, setTrendingPosts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        const response = await articleCrud.getArticles({
          listType: PostTypeEnum.TRENDING_POSTS,
          pageSize: 4,
          isPublished: true
        })
        setTrendingPosts(response.result || [])
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
    return <TrendingPostsSkeleton />
  }

  if (!trendingPosts.length) return null

  return (
    <div id="TrendingPosts">
      <BlockHeader title="Trending" />
      <Flex vertical gap={24}>
        {trendingPosts.map((postItem) => (
          <TrendingPostItem key={postItem.id} post={postItem} />
        ))}
      </Flex>
    </div>
  )
}

export default TrendingPosts
