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
import ArticleDetailPage from '@/app/admin/articles/view/[id]/page'

const PostDetailView = () => {
  const pathname = usePathname()
  const { message: messageApi } = App.useApp()

  const postId = pathname.substring(pathname.lastIndexOf('/') + 1)

  const [isGetPostLoading, setIsGetPostLoading] = useState(false)
  const [postData, setPostData] = useState<Article>()

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
  }, [])

  if (isGetPostLoading) {
    return (
      <div className="post-detail-loading">
        <LoadingSpinner />
      </div>
    )
  }

  if (!postData) return null

  return (
    <div>
      <ArticleDetailPage params={{ id: postId, noHeader: true }} />

    </div>
  )
}

export default PostDetailView
