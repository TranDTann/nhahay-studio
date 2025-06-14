import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Tag {
  id?: string
  name: string
  description?: string
  createdAt?: string
}

export const tagCrud = {
  getTags: async () => {
    try {
      const response = await axiosInstance.get<{
        result: Tag[]
        count: number
      }>('/api/tag')
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  createTag: async (title: string) => {
    try {
      const response = await axiosInstance.post<Tag>('/api/tag', title)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  updateTag: async (data: { id: string; name: string }) => {
    try {
      const response = await axiosInstance.put<Tag>(`/api/tag/${data.id}`, data)
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
