import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'
interface Article {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}
export const articleCrud = {
  getArticles: async () => {
    try {
      const response = await axiosInstance.get<any>('/api/article')
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  createArticle: async (
    articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await axiosInstance.post('/api/article', articleData)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  updateArticle: async (id: string, articleData: Partial<Article>) => {
    try {
      const response = await axiosInstance.put(
        `/api/article/${id}`,
        articleData
      )
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  deleteArticle: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/article/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
