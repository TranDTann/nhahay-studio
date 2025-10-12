import { message } from 'antd'
import { create } from 'zustand'
import { ratingCrud, TPostRatingPayload, TRating } from './crud'

interface RatingPostState {
  loading: boolean
  error: string | null
  count: number
  ratings: TRating[]
  postRating: (data: TPostRatingPayload) => Promise<TRating>
  updateRating: (data: TPostRatingPayload) => Promise<TRating>
  getRatings: (postId: string) => Promise<void>
}

export const useRatingPostStore = create<RatingPostState>((set, get) => ({
  loading: false,
  error: null,
  count: 0,
  ratings: null,
  postRating: async (data: TPostRatingPayload) => {
    set({ loading: true, error: null })
    try {
      const result = await ratingCrud.postRating(data)
      set({
        loading: false
      })

      return result.data
    } catch (error) {
      const errorMessage = 'Đánh giá bài viết thất bại!'
      set({ error: errorMessage, loading: false })
      message.error(errorMessage)
    }
  },
  updateRating: async (data: TPostRatingPayload) => {
    set({ loading: true, error: null })
    try {
      const result = await ratingCrud.updateRating(data)
      set({
        loading: false
      })

      return result.data
    } catch (error) {
      const errorMessage = 'Cập nhật đánh giá bài viết thất bại!'
      set({ error: errorMessage, loading: false })
      message.error(errorMessage)
    }
  },
  getRatings: async (postId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await ratingCrud.getRatings(postId)

      set({
        loading: false,
        ratings: response.result,
        count: response.count
      })
    } catch (error) {
      const errorMessage = 'Lấy comment của bài viết thất bại'
      set({ error: errorMessage, loading: false })
      message.error(errorMessage)
    }
  }
}))

export const resetRatingPostData = () => {
  useRatingPostStore.setState({
    loading: undefined,
    error: undefined,
    count: 0,
    ratings: []
  })
}
