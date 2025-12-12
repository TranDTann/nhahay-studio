'use client'

import { Article } from '@/store/article/crud'
import { useAuthStore } from '@/store/auth/authStore'
import { resetCommentData, useCommentStore } from '@/store/comment/commentStore'
import { SendOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { useEffect, useState } from 'react'
import CommentItem from './CommentItem'
import './styles.scss'

const { TextArea } = Input

type TCommentProps = {
  postData: Article
}

const Comment = ({ postData }: TCommentProps) => {
  const { authUser } = useAuthStore((state) => state)
  const { getComments, postComment, comments, count } = useCommentStore(
    (state) => state
  )
  const isLoggedIn = !!authUser

  const [commentValue, setCommentValue] = useState('')
  const [isPostCommentLoading, setIsPostCommentLoading] = useState(false)

  useEffect(() => {
    return () => {
      resetCommentData()
    }
  }, [])

  useEffect(() => {
    getComments(postData.id)
  }, [getComments, postData.id])

  const handlePostComment = async () => {
    setIsPostCommentLoading(true)

    try {
      const newComment = await postComment({
        content: commentValue,
        postId: postData.id,
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

  const textAreaComment = isLoggedIn ? (
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
        <SendOutlined className="send-button color-primary" />
      </Button>
    </Flex>
  ) : null

  const commentContent = comments?.length ? (
    <div>
      <div className={`comment-list ${!isLoggedIn && 'p-4'}`}>
        {comments.map((commentItem) => {
          return <CommentItem key={commentItem.id} comment={commentItem} />
        })}
      </div>
      {textAreaComment}
    </div>
  ) : (
    textAreaComment
  )

  return (
    <div id="Comment">
      <h3 className="comment-container-title">
        Bình luận {count ? <span>({count})</span> : null}
      </h3>
      <div className={`${isLoggedIn && 'comment-container'}`}>
        {commentContent}
      </div>
    </div>
  )
}

export default Comment
