'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { App, Flex } from 'antd'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import PopularPostItem from './PopularPostItem/PopularPostItem'
import PopularPostsSkeleton from './PopularPostsSkeleton/PopularPostsSkeleton'
import './styles.scss'

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
          pageSize: 4,
          isPublished: true
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

  return (
    <div id="PopularPosts">
      <BlockHeader title="Phổ biến" />
      <Flex vertical gap={24}>
        {polularPosts.map((postItem) => (
          <PopularPostItem key={postItem.id} post={postItem} />
        ))}
      </Flex>
    </div>
  )
}

export default PopularPosts
