import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'
export interface Article {
  id: string
  title: string
  content: string
  tagIds: string[]
  categoryId: string
  advertisementIds: string[]
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
  getArticles: async (params?: {
    search?: string
    tags?: string[]
    categoryId?: string
    page?: number
    pageSize?: number
    sort?: string
    SortDir?: number
    listType?: number
  }) => {
    try {
      const query = new URLSearchParams()

      Object.entries({
        search: params?.search,
        categoryId: params?.categoryId,
        sort: params?.sort,
        SortDir: params?.SortDir?.toString(),
        listType: params?.listType?.toString(),
        tags: params?.tags?.length ? params.tags.join(',') : undefined
      }).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, value)
      })

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
