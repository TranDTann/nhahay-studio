import { message } from 'antd'
import { create } from 'zustand'
import { commentCrud, TComment, TCommentContent } from './crud'

interface CommentState {
  loading: boolean
  error: string | null
  count: number
  comments: TComment[]
  postComment: (data: TCommentContent) => Promise<TComment>
  getComments: (postId: string) => Promise<void>
}

export const useCommentStore = create<CommentState>((set, get) => ({
  loading: false,
  error: null,
  count: 0,
  comments: null,
  postComment: async (data: TCommentContent) => {
    set({ loading: true, error: null })
    try {
      const result = await commentCrud.postComment(data)
      set({
        loading: false
      })

      return result.data
    } catch (error) {
      const errorMessage = 'Bình luận thất bại!'
      set({ error: errorMessage, loading: false })
      message.error(errorMessage)
    }
  },
  getComments: async (postId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await commentCrud.getComments(postId)

      set({
        loading: false,
        comments: response.result,
        count: response.count
      })
    } catch (error) {
      const errorMessage = 'Lấy comment của bài viết thất bại'
      set({ error: errorMessage, loading: false })
      message.error(errorMessage)
    }
  }
}))

export const resetCommentData = () => {
  useCommentStore.setState({
    loading: false,
    error: null,
    count: 0,
    comments: null
  })
}
