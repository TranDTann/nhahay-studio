'use client'

import { useCommentStore } from '@/store/comment/commentStore'
import { TComment } from '@/store/comment/crud'
import { SendOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import './styles.scss'

type TCommentItemProps = {
  comment: TComment
}

const CommentItem = ({ comment }: TCommentItemProps) => {
  const pathname = usePathname()
  const postId = pathname.substring(pathname.lastIndexOf('/') + 1)

  const [repliedCommentValue, setRepliedCommentValue] = useState('')
  const [repliedComment, setRepliedComment] = useState<TComment>()
  const [isReplyCommentLoading, setIsReplyCommentLoading] = useState(false)

  const { postComment } = useCommentStore((state) => state)

  const handleReplyComment = async () => {
    setIsReplyCommentLoading(true)

    try {
      const newComment = await postComment({
        content: repliedCommentValue,
        postId,
        parentCommentId: repliedComment.id
      })

      setRepliedComment(null)
      setRepliedCommentValue(null)

      useCommentStore.setState((state) => ({
        count: state.count + 1,
        comments: state.comments.map((item) => {
          if (item.id !== repliedComment.id) {
            return item
          }

          return { ...item, replies: [...item.replies, newComment] }
        })
      }))
    } catch (err) {
      console.log(err)
    } finally {
      setIsReplyCommentLoading(false)
    }
  }

  if (!comment) {
    return null
  }

  return (
    <Flex gap={12}>
      <div className="comment-user-icon">
        <FaUser />
      </div>
      <div className="comment-content-container">
        <p className="comment-author">{comment.commentUserName}</p>
        <p className="comment-content">{comment.content}</p>
        <Button
          type="link"
          className="reply-button"
          onClick={() => setRepliedComment(comment)}
        >
          Trả lời
        </Button>
        {!!comment.replies.length &&
          comment.replies.map((commentItem) => {
            return (
              <Flex gap={12} id="CommentItem">
                <div className="comment-user-icon">
                  <FaUser />
                </div>
                <div className="comment-content-container">
                  <p className="comment-author">
                    {commentItem.commentUserName}
                  </p>
                  <p className="comment-content">{commentItem.content}</p>
                  <Button
                    type="link"
                    className="reply-button"
                    onClick={() => setRepliedComment(commentItem)}
                  >
                    Trả lời
                  </Button>
                  {repliedComment?.id === commentItem.id && (
                    <Flex>
                      <Input
                        placeholder={`Trả lời ${repliedComment.commentUserName}`}
                        className="reply-input"
                        value={repliedCommentValue}
                        onChange={(e) => setRepliedCommentValue(e.target.value)}
                      />
                      <Button
                        type="link"
                        onClick={handleReplyComment}
                        disabled={!repliedCommentValue}
                        loading={isReplyCommentLoading}
                      >
                        <SendOutlined className="send-reply-button" />
                      </Button>
                    </Flex>
                  )}
                </div>
              </Flex>
            )
          })}
        {repliedComment?.id === comment.id && (
          <Flex>
            <Input
              placeholder={`Trả lời ${repliedComment.commentUserName}`}
              className="reply-input"
              value={repliedCommentValue}
              onChange={(e) => setRepliedCommentValue(e.target.value)}
            />
            <Button
              type="link"
              onClick={handleReplyComment}
              disabled={!repliedCommentValue}
              loading={isReplyCommentLoading}
            >
              <SendOutlined className="send-reply-button" />
            </Button>
          </Flex>
        )}
      </div>
    </Flex>
  )
}

export default CommentItem
