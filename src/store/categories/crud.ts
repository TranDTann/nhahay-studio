/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface Category {
  id?: string
  name: string
  description?: string
  urlThumbnail?: string
  createdAt?: string
}

export interface CategoryFilters {
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

export const categoryCrud = {
  getCategory: async (filters?: CategoryFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.SortDir !== undefined)
        params.append('SortDir', filters.SortDir.toString())
      if (filters?.take) params.append('take', filters.take.toString())
      if (filters?.skip) params.append('skip', filters.skip.toString())

      const url = `/api/category${
        params.toString() ? `?${params.toString()}` : ''
      }`
      const response = await axiosInstance.get<{
        result: Category[]
        count: number
      }>(url)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  },

  createCategory: async (data: {
    name: string
    description?: string
    urlThumbnail?: string
    bannerIds?: string[]
  }) => {
    try {
      const response = await axiosInstance.post<Category>('/api/category', data)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to create category',
        error.response?.status
      )
    }
  },

  updateCategory: async (
    id: string,
    data: {
      name: string
      description?: string
      urlThumbnail?: string
      bannerIds?: string[]
    }
  ) => {
    try {
      const response = await axiosInstance.put<Category>(`/api/category`, {
        ...data,
        id
      })
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update category',
        error.response?.status
      )
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/category/${id}`)
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete category',
        error.response?.status
      )
    }
  }
}
