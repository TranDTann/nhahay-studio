'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App } from 'antd'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import MainTrendingPost from './MainTrendingPost/MainTrendingPost'
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

  const mainPost = trendingPosts[0]
  const belowPosts = trendingPosts.slice(1, 4)

  return (
    <div id="TrendingPosts">
      <BlockHeader title="Trending" />
      <MainTrendingPost postData={mainPost} />
      <div className="below-posts-container">
        {belowPosts.map((post) => (
          <TrendingPostItem key={post.id} postData={post} />
        ))}
      </div>
    </div>
  )
}

export default TrendingPosts
