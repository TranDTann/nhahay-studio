'use client'

import { LoginInformation } from '@/components/Navigation/LoginInformation'
import { useAuthStore } from '@/store/auth/authStore'
import { useCommentStore } from '@/store/comment/commentStore'
import { SendOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import CommentItem from './CommentItem'
import './styles.scss'

const { TextArea } = Input

type TCommentProps = {}

const Comment = ({}: TCommentProps) => {
  const pathname = usePathname()
  const postId = pathname.substring(pathname.lastIndexOf('/') + 1)
  const { authUser } = useAuthStore((state) => state)
  const { getComments, postComment, comments } = useCommentStore(
    (state) => state
  )
  const isLoggedIn = !!authUser

  const [commentValue, setCommentValue] = useState('')
  const [isPostCommentLoading, setIsPostCommentLoading] = useState(false)

  useEffect(() => {
    getComments(postId)
  }, [getComments, postId])

  const handlePostComment = async () => {
    setIsPostCommentLoading(true)

    try {
      const newComment = await postComment({
        content: commentValue,
        postId,
        parentCommentId: undefined
      })

      setCommentValue(null)

      useCommentStore.setState((state) => ({
        count: state.count + 1,
        comments: [...state.comments, newComment]
      }))
    } catch (err) {
      console.log(err)
    } finally {
      setIsPostCommentLoading(false)
    }
  }

  const contentWithoutLogin = (
    <div className="comment-container_not-login">
      <p>Bạn cần đăng nhập để bình luận về bài viết này</p>
      <LoginInformation />
    </div>
  )

  const contentWhenLoggedIn = comments?.length ? (
    <div>
      <div className="comment-list">
        {comments.map((commentItem) => {
          return <CommentItem comment={commentItem} />
        })}
      </div>
      <Flex align="flex-end" justify="space-between" gap={8}>
        <TextArea
          rows={4}
          placeholder="Hãy để lại bình luận của bạn tại đây..."
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          className="comment-textarea"
        />
        <Button
          type="link"
          onClick={handlePostComment}
          disabled={!commentValue}
          loading={isPostCommentLoading}
        >
          <SendOutlined className="send-button" />
        </Button>
      </Flex>
    </div>
  ) : null

  return (
    <div id="Comment">
      <h2 className="comment-container-title">
        Bình luận {comments?.length ? <span>({comments.length})</span> : null}
      </h2>
      <div className={`${isLoggedIn && 'comment-container'}`}>
        {isLoggedIn ? contentWhenLoggedIn : contentWithoutLogin}
      </div>
    </div>
  )
}

export default Comment
