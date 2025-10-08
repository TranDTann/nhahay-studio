/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'

export type TCommentContent = {
  content: string
  postId: string
  parentCommentId: string
}

export type TComment = {
  commentUserId: string
  commentUserName: string
  content: string
  createdAt: string
  createdByUser: { id: string; username: string }
  id: string
  postId: string
  replies: TComment[]
  updatedAt: null
  updatedByUser: null
}

export type TCommentListResponse = {
  result: TComment[]
  count: number
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const commentCrud = {
  postComment: async (data: TCommentContent) => {
    try {
      const response = await axiosInstance.post<TComment>('/api/comment', data)

      console.log(response)
      return response
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Bình luận thất bại!',
        error.response?.status
      )
    }
  },
  getComments: async (postId: string, page = 1, take = 10) => {
    try {
      const skip = page > 1 ? (page - 1) * take : 0
      const params = new URLSearchParams()
      params.append('take', String(take))
      params.append('skip', String(skip))
      const url = `/api/comment/post/${postId}?${params.toString()}`
      const response = await axiosInstance.get<TCommentListResponse>(url)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Lấy danh sách liên hệ thất bại',
        error.response?.status
      )
    }
  }
}
