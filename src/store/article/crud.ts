import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Article {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string | null
  createdByUser: { email: string; id: string; username: string }
  updatedByUser: { email: string; id: string; username: string } | null
  publishAt: string | null
  status: number
  viewAmount: number
  ratingAvg: number
  commentAmount: number
  category: {
    id: string
    name: string
    description: string
    urlThumnail: string
  }
  tags: { id: string; name: string; description: string }[]
  advertisements: []
  relatedPosts: []
  image: string
  description: string
  isFeatured: boolean
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
    isPublished?: boolean
  }) => {
    try {
      const query = new URLSearchParams()

      Object.entries({
        search: params?.search,
        categoryId: params?.categoryId || '',
        sort: params?.sort,
        SortDir: params?.SortDir?.toString(),
        listType: params?.listType?.toString(),
        tags: params?.tags?.length ? params.tags.join(',') : undefined
      }).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, value)
      })

      // Get post published
      params?.isPublished &&
        query.append('isPublished', String(params?.isPublished))

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
