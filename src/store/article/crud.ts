import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'
interface Article {
  id: string
  title: string
  content: string
  tags: string[]
  image: string
  description: string
  createdAt: string
  updatedAt: string
}
export const articleCrud = {
  getArticles: async (params?: {
    search?: string
    tags?: string[]
    categoryId?: string
    page?: number
    pageSize?: number
    sort?: string
    SortDir?: number
  }) => {
    try {
      const query = new URLSearchParams()
      if (params?.search) query.append('search', params.search)
      if (params?.categoryId) query.append('categoryId', params.categoryId)
      if (params?.tags && params.tags.length > 0)
        query.append('tags', params.tags.join(','))
      if (params?.sort) query.append('sort', params.sort)
      if (params?.SortDir !== undefined)
        query.append('SortDir', params.SortDir.toString())
      // Chuyển page/pageSize thành take/skip
      const take = params?.pageSize || 10
      const skip =
        params?.page && params.page > 1 ? (params.page - 1) * take : 0
      query.append('take', take.toString())
      query.append('skip', skip.toString())
      const url = `/api/post${query.toString() ? `?${query.toString()}` : ''}`
      const response = await axiosInstance.get<any>(url)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  getArticleById: async (id: string) => {
    try {
      const response = await axiosInstance.get<any>(`/api/post/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  createArticle: async (
    articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await axiosInstance.post('/api/post', articleData)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  updateArticle: async (id: string, articleData: Partial<Article>) => {
    try {
      const response = await axiosInstance.put(`/api/post/${id}`, articleData)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  deleteArticle: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/post/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
