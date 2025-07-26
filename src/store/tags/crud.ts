import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Tag {
  id?: string
  name: string
  description?: string
  createdAt?: string
}

export interface TagFilters {
  search?: string
  sort?: string
  sortDis?: number
  take?: number
  skip?: number
}

export const tagCrud = {
  getTags: async (filters?: TagFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.sortDis !== undefined)
        params.append('sortDis', filters.sortDis.toString())
      if (filters?.take) params.append('take', filters.take.toString())
      if (filters?.skip) params.append('skip', filters.skip.toString())

      const url = `/api/tag${params.toString() ? `?${params.toString()}` : ''}`
      const response = await axiosInstance.get<{
        result: Tag[]
        count: number
      }>(url)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  createTag: async (data: { name: string; description?: string }) => {
    try {
      const response = await axiosInstance.post<Tag>('/api/tag', data)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  updateTag: async (data: {
    id: string
    name: string
    description?: string
  }) => {
    try {
      const response = await axiosInstance.put<Tag>(`/api/tag`, data)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  deleteTag: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/tag/${id}`)
    } catch (error) {
      handleApiError(error)
    }
  }
}
