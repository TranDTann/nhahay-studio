'use client'

import ArticleDetailPage from '@/app/admin/articles/view/[id]/page'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import paths from '@/routes/paths'
import { Article, articleCrud } from '@/store/article/crud'
import { useAuthStore } from '@/store/auth/authStore'
import { getIdFromPathname } from '@/utils/generatePath'
import { App, Button, Flex } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Comment from '../Comment/Comment'
import Rating from '../Rating/Rating'
import RelatedPosts from '../RelatedPosts/RelatedPosts'
import './styles.css'

const PostDetailView = () => {
  const router = useRouter()

  const { authUser } = useAuthStore((state) => state)
  const isLoggedIn = !!authUser

  const pathname = usePathname()
  const { message: messageApi } = App.useApp()

  const postId = getIdFromPathname(pathname)

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

  const handleClickLogin = () => {
    useAuthStore.setState({
      postDetailPage: { id: postData.id, title: postData.title }
    })
    router.push(paths.auth.login)
  }

  if (!postData) return null

  return (
    <div className="post-detail-container">
      <ArticleDetailPage params={{ id: postId, noHeader: true }} />
      <p className="note-scroll-comment">
        Kéo xuống một chút nữa bạn sẽ thấy phần đánh giá, bình luận hoặc truy
        cập hệ sinh thái của chúng tôi trên các nền tảng phía trên:
      </p>
      {!isLoggedIn && (
        <Flex
          vertical
          align="center"
          justify="center"
          gap={12}
          className="comment-container_not-login"
        >
          <p>Bạn cần đăng nhập để bình luận và đánh giá về bài viết này</p>
          <Button
            className="background-color-primary"
            type="primary"
            onClick={handleClickLogin}
          >
            Đăng nhập
          </Button>
        </Flex>
      )}
      <Rating postData={postData} />
      <Comment postData={postData} />
      <RelatedPosts postData={postData} />
    </div>
  )
}

export default PostDetailView
