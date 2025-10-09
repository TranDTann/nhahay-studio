/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'

export type TPostRatingPayload = {
  ratingUserId: string
  ratingUserName: string
  rating: number
  postId: string
}

export type TRating = {
  createdAt: string
  id: string
  postId: string
  rating: 4
  ratingUserId: string
  ratingUserName: string
  updatedAt: string
}

export type TRatingListResponse = {
  result: TRating[]
  count: number
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const ratingCrud = {
  postRating: async (data: TPostRatingPayload) => {
    try {
      const response = await axiosInstance.post<TRating>(
        '/api/ratingscore',
        data
      )

      return response
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Đánh giá bài viết thất bại!',
        error.response?.status
      )
    }
  },
  getRatings: async (postId: string, page = 1, take = 10000) => {
    try {
      const skip = page > 1 ? (page - 1) * take : 0
      const params = new URLSearchParams()
      params.append('take', String(take))
      params.append('skip', String(skip))
      const url = `/api/ratingscore/post/${postId}?${params.toString()}`
      const response = await axiosInstance.get<TRatingListResponse>(url)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Lấy đánh giá thất bại',
        error.response?.status
      )
    }
  }
}
