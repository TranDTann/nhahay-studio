import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Video {
  id?: string
  title: string
  contentListVideo: string
  videoPositionPage?: string
  createdAt?: string
}

export interface VideoFilters {
  search?: string
  sort?: string
  SortDir?: number
  take?: number
  skip?: number
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const videoCrud = {
  getVideos: async (filters?: VideoFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.SortDir !== undefined)
        params.append('SortDir', filters.SortDir.toString())
      if (filters?.take) params.append('take', filters.take.toString())
      if (filters?.skip) params.append('skip', filters.skip.toString())

      const url = `/api/contentvideo${
        params.toString() ? `?${params.toString()}` : ''
      }`
      const response = await axiosInstance.get<{
        result: Video[]
        count: number
      }>(url)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  },

  createVideo: async (data: Omit<Video, 'id' | 'createdAt'>) => {
    try {
      const response = await axiosInstance.post<Video>(
        '/api/contentvideo',
        data
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to create video',
        error.response?.status
      )
    }
  },

  updateVideo: async (data: Partial<Video>) => {
    try {
      const response = await axiosInstance.put<Video>(`/api/contentvideo`, data)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update video',
        error.response?.status
      )
    }
  },

  deleteVideo: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/contentvideo/${id}`)
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete video',
        error.response?.status
      )
    }
  }
}
