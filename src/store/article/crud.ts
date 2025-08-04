import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'
export interface Article {
  id: string
  title: string
  content: string
  tags: string[]
  image: string
  description: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    description: string
  }
  createdBy: string
  ratingAvg: string
  publishAt: string
  readingTimeMinutes: number
}

export const articleCrud = {
  getArticles: async (params?: any) => {
    try {
      const response = await axiosInstance.get<any>('/api/post', {
        params
      })
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
