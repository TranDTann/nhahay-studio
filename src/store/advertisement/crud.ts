import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Advertisement {
  id?: string
  title: string
  description?: string
  image?: string
  link?: string
  categoryId?: string
  category?: {
    id: string
    name: string
  }
  createdAt?: string
}

export interface AdvertisementFilters {
  search?: string
  sort?: string
  sortDis?: number
  take?: number
  skip?: number
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const advertisementCrud = {
  getAdvertisements: async (filters?: AdvertisementFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.sortDis !== undefined)
        params.append('sortDis', filters.sortDis.toString())
      if (filters?.take) params.append('take', filters.take.toString())
      if (filters?.skip) params.append('skip', filters.skip.toString())

      const url = `/api/advertisement${
        params.toString() ? `?${params.toString()}` : ''
      }`
      const response = await axiosInstance.get<{
        result: Advertisement[]
        count: number
      }>(url)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  },

  createAdvertisement: async (
    data: Omit<Advertisement, 'id' | 'createdAt'>
  ) => {
    try {
      const response = await axiosInstance.post<Advertisement>(
        '/api/advertisement',
        data
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to create advertisement',
        error.response?.status
      )
    }
  },

  updateAdvertisement: async (id: string, data: Partial<Advertisement>) => {
    try {
      const response = await axiosInstance.put<Advertisement>(
        `/api/advertisement/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update advertisement',
        error.response?.status
      )
    }
  },

  deleteAdvertisement: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/advertisement/${id}`)
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete advertisement',
        error.response?.status
      )
    }
  }
}
