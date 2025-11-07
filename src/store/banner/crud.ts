import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Banner {
  id?: string
  title: string
  imageUrl: string
  link?: string
  position?: string
  status: boolean
  createdAt?: string
  clickBannerAmount?: number
}

export interface BannerFilters {
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

export const bannerCrud = {
  getBanners: async (filters?: BannerFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.SortDir !== undefined)
        params.append('SortDir', filters.SortDir.toString())
      if (filters?.take) params.append('take', filters.take.toString())
      if (filters?.skip) params.append('skip', filters.skip.toString())

      const url = `/api/banner${
        params.toString() ? `?${params.toString()}` : ''
      }`
      const response = await axiosInstance.get<{
        result: Banner[]
        count: number
      }>(url)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  },

  getBannerById: async (id: string) => {
    try {
      const response = await axiosInstance.get<Banner>(`/api/banner/${id}`)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  },

  createBanner: async (data: Omit<Banner, 'id' | 'createdAt'>) => {
    try {
      const response = await axiosInstance.post<Banner>('/api/banner', data)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to create banner',
        error.response?.status
      )
    }
  },

  updateBanner: async (data: Partial<Banner>) => {
    try {
      const response = await axiosInstance.put<Banner>(`/api/banner`, data)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update banner',
        error.response?.status
      )
    }
  },

  deleteBanner: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/banner/${id}`)
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete banner',
        error.response?.status
      )
    }
  }
}
