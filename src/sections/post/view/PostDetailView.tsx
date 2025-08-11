'use client'

import ArticleRenderer from '@/components/ArticleRenderer'
import { FollowUs } from '@/components/Footer/FollowUs'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Article, articleCrud } from '@/store/article/crud'
import { App } from 'antd'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import PostDetailHeader from '../PostDetailHeader/PostDetailHeader'
import './styles.css'

const PostDetailView = () => {
  const pathname = usePathname()
  const { message: messageApi } = App.useApp()

  const postId = pathname.substring(pathname.lastIndexOf('/') + 1)

  const [isGetPostLoading, setIsGetPostLoading] = useState(false)
  const [postData, setPostData] = useState<Article[]>([])

  useEffect(() => {
    const fetchPostsDetailData = async () => {
      try {
        setIsGetPostLoading(true)

        const response = await articleCrud.getArticleById(postId)

        setPostData(response)
      } catch (error) {
        messageApi.error(
          error?.response?.data?.message || 'Lấy thông tin bài viết thất bại!'
        )
      } finally {
        setIsGetPostLoading(false)
      }
    }

    fetchPostsDetailData()
  }, [postId])

  if (isGetPostLoading) {
    return (
      <div className="post-detail-loading">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="post-detail-container">
      <PostDetailHeader postData={postData} />
      <div className="post-detail-body">
        <ArticleRenderer content={postData.content} />
        <FollowUs mode="light" />
      </div>
    </div>
  )
}

export default PostDetailView
